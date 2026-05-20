import * as fs from "fs";
import * as path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
import { Readable } from "stream";
const pump = promisify(pipeline);

export class UploadService {
  private uploadDir = path.join(__dirname, "../../public/uploads");

  async saveFromStream(file: Readable, filename: string) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${filename}`;
    const filePath = path.join(this.uploadDir, fileName);
    await pump(file, fs.createWriteStream(filePath));

    const baseUrl = process.env.BACKEND_URL || "http://localhost:3001";
    return {
      url: `${baseUrl}/uploads/${fileName}`,
      fileName,
    };
  }
}

export const uploadService = new UploadService();
