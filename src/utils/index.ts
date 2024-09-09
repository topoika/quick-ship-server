import db from "../db/models";

export const convertToSlug = (string: string) => {
  const a =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const b =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");

  const id_prefix = Math.floor(Math.random() * 1000) + 1000;

  return (
    string
      .toString()
      .toLowerCase()
      // Replace spaces with -
      .replace(/\s+/g, "-")
      // Replace special characters
      .replace(p, (c) => b.charAt(a.indexOf(c)))
      // Replace & with 'and'
      .replace(/&/g, "-and-")
      // Remove all non-word characters
      .replace(/[^\w\-\\]+/g, "")
      // Replace multiple - with single -
      // .replace(/\-\-+/g, '-')
      // Trim - from start of text
      .replace(/^-+/, "")
      // Trim - from end of text
      .replace(/-+$/, "") +
    "_" +
    String(id_prefix)
  );
};

export const generateUniqeId = async (payload: {
  modelName: string;
  prefix: string;
}) => {
  const { modelName, prefix } = payload;

  try {
    const result = await db[modelName].findOne({
      attributes: ["id"],
      order: [["id", "DESC"]],
    });

    const lastId = result ? result.id + 1 : 1;
    const timestamp = Date.now();

    return {
      position: lastId,
      uid: prefix + timestamp.toString() + lastId.toString(),
    };
  } catch (error) {
    console.log(error);
    return { error: [{ name: "transaction", message: "transaction failed" }] };
  }
};

export const formatDateIST = (date: any) => {
  // return (date ? new Date(date) : new Date()).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
  return date ? new Date(date) : new Date();
};
