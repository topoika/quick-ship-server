import fs from "fs";
import path from "path";

/**
 * Deletes a file from the file system.
 * @param filePath - The path to the file to delete (relative to the 'uploads' directory).
 */
const deleteFile = (filePath: string): void => {
  try {
    const cleanedPath = filePath.startsWith("/")
      ? filePath.substring(1)
      : filePath;
    const fullPath = path.resolve(process.cwd(), "uploads", cleanedPath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    } else {
      console.log(`File not found.`);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};
export default deleteFile;
