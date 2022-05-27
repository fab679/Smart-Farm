import { Readable } from "stream";
import type {
  UploadApiErrorResponse,
  UploadApiResponse,
  UploadApiOptions,
  UploadStream,
} from "cloudinary";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: "fabisch-final-year-project",
  api_key: "876586341747683",
  api_secret: "yOf38Wm3-1E4BCYlxQMpLoekaXc",
});

export async function uploadStreamToCloudinary(
  stream: Readable,
  options?: UploadApiOptions
): Promise<UploadApiResponse | UploadApiErrorResponse> {
  return await new Promise((resolve, reject) => {
    const uploader = cloudinary.v2.uploader.upload_stream(
      options,
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    stream.pipe(uploader);
  });
}
