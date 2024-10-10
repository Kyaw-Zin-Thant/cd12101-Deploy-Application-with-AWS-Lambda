import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client();
const bucketName = process.env.IMAGES_S3_BUCKET;
const signedUrlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);

export async function getUploadUrl(todoId) {
  const uploadCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId
  });

  try {
    const uploadUrl = await getSignedUrl(s3Client, uploadCommand, {
      expiresIn: signedUrlExpiration
    });
    console.log(`Generated upload URL: ${uploadUrl} for todoId: ${todoId}`);
    return uploadUrl;
  } catch (error) {
    console.error('Failed to generate upload URL:', error);
    throw new Error('Unable to generate upload URL');
  }
}
