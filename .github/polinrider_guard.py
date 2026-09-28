#!/usr/bin/env python3
"""
polinrider_guard.py - detect PolinRider-style malware in a project. No dependencies.

  python3 polinrider_guard.py [PATH]      scan a folder (default: current folder)
  python3 polinrider_guard.py --staged    scan only files staged for commit (git hook)

Exit code 0 = clean, 1 = malware found, 2 = error.
In GitHub Actions it also prints ::error annotations so findings show on the commit.

Flags:
  - payload markers anywhere (global.i=, global['!'], global['_V'], _$_1e42, rmcej%otb%, Cot%3t=shtP, ...)
  - config files (postcss/tailwind/next/vite/eslint/...) with code hidden after 100+ spaces/tabs
  - config files that suddenly weigh > 4 KB
  - "font" files that are not real fonts (fa-solid-400.woff2, fa-solid-300.llf, ...)
  - .vscode/tasks.json that runs node/curl/wget automatically on folder open
  - spellright.dict files containing JavaScript
  - temp_auto_push.bat / temp_interactive_push.bat / config.bat and the .gitignore lines hiding them
  - package.json depending on known malicious packages
"""
import os, re, subprocess, sys

MARK_RE = re.compile(r"global\.i\s*=\s*'|global\[['\"]!['\"]\]\s*=|global\[['\"]_V['\"]\]\s*=|_\$_1e42|"
                     r"rmcej%otb%|Cot%3t=shtP|0xa322E5f3D311D3080e6f0121063e9aDC2490Ef1a", re.I)
CONFIG_RE = re.compile(r"(^|/)(postcss|tailwind|next|vite|eslint|babel|webpack|nuxt|svelte|astro|vue|jest|"
                       r"vitest|prettier|metro|rollup|tsup|craco)\.config\.(js|mjs|cjs|ts|mts|cts)$|"
                       r"(^|/)\.eslintrc\.(js|cjs)$")
HIDDEN_RE = re.compile(r"[ \t]{100,}\S")
FONT_EXT = (".woff", ".woff2", ".ttf", ".otf", ".eot", ".llf")
FONT_MAGIC = (b"wOF2", b"wOFF", b"\x00\x01\x00\x00", b"OTTO", b"true", b"ttcf")
BAD_FILES = {"temp_auto_push.bat", "temp_interactive_push.bat", "config.bat"}
BAD_GITIGNORE = {"temp_auto_push.bat", "temp_interactive_push.bat", "branch_structure.json", "config.bat"}
BAD_PACKAGES = re.compile(r'"(tailwindcss-style-animate|tailwind-mainanimation|tailwind-autoanimation)"')
SKIP_DIRS = {".git", "node_modules", ".next", "build", "dist", ".dart_tool", "Pods", ".gradle", ".venv", "venv"}
MAX = 8_000_000


def check_file(rel, data):
    """Return a list of findings for one file."""
    rel = rel.replace("\\", "/")
    name = rel.rsplit("/", 1)[-1]
    low = name.lower()
    text = data.decode("latin-1")
    out = []
    if low in BAD_FILES:
        out.append("PolinRider propagation script")
    if MARK_RE.search(text):
        out.append("PolinRider payload marker")
    if CONFIG_RE.search(rel):
        if HIDDEN_RE.search(text):
            out.append("code hidden after a long run of whitespace")
        elif len(data) > 4096 and not out:
            out.append(f"WARNING: config file is unusually large ({len(data)} bytes) - take a look")
    if low.endswith(FONT_EXT):
        real = data[34:36] == b"LP" if low.endswith(".eot") else data.startswith(FONT_MAGIC)
        if not real and not data.startswith(b"version https://git-lfs"):
            out.append("fake font file (not a real font)")
    if rel.endswith(".vscode/tasks.json") and "folderOpen" in text and \
            re.search(r"node |curl |wget |powershell|\.woff|\.llf|bash -c|sh -c", text):
        out.append("VS Code task that runs a command automatically when the folder opens")
    if low == "spellright.dict" and re.search(r"require\(|global\[|eval\(|function", text):
        out.append("spellright.dict contains JavaScript")
    if name == ".gitignore":
        hits = [l.strip() for l in text.splitlines() if l.strip() in BAD_GITIGNORE]
        if hits:
            out.append(".gitignore hides PolinRider files: " + ", ".join(hits))
    if name == "package.json":
        m = BAD_PACKAGES.search(text)
        if m:
            out.append(f"depends on malicious package {m.group(1)}")
    return out


def scan_folder(root):
    findings = []
    for dp, dns, fns in os.walk(root):
        dns[:] = [d for d in dns if d not in SKIP_DIRS]
        for fn in fns:
            p = os.path.join(dp, fn)
            try:
                if os.path.getsize(p) > MAX:
                    continue
                data = open(p, "rb").read()
            except OSError:
                continue
            for f in check_file(os.path.relpath(p, root), data):
                findings.append((os.path.relpath(p, root), f))
    return findings


def scan_staged():
    names = subprocess.run(["git", "diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"],
                           capture_output=True).stdout.decode().split("\0")
    findings = []
    for n in filter(None, names):
        data = subprocess.run(["git", "show", f":{n}"], capture_output=True).stdout
        if len(data) <= MAX:
            findings += [(n, f) for f in check_file(n, data)]
    return findings


def main():
    args = sys.argv[1:]
    try:
        findings = scan_staged() if "--staged" in args else scan_folder(next((a for a in args if not a.startswith("-")), "."))
    except Exception as e:
        print(f"polinrider_guard: error: {e}", file=sys.stderr)
        return 2
    gha = os.environ.get("GITHUB_ACTIONS") == "true"
    bad = [f for f in findings if not f[1].startswith("WARNING")]
    for path, what in findings:
        if what.startswith("WARNING"):
            print(f"  {path}: {what}")
            if gha:
                print(f"::warning file={path},title=Check this config::{what}")
    if not bad:
        print("polinrider_guard: clean")
        return 0
    print(f"polinrider_guard: {len(bad)} malware finding(s):")
    for path, what in bad:
        print(f"  {path}: {what}")
        if gha:
            print(f"::error file={path},title=PolinRider malware::{what}")
    if "--staged" in args:
        print("\nCommit blocked. Remove these files/lines first. (Only if you are 100% sure it is a false alarm: git commit --no-verify)")
    return 1


if __name__ == "__main__":
    sys.exit(main())
