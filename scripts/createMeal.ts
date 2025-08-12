/* eslint-disable no-console */
import { promises as fs } from 'fs';
import path from 'path';

const API_URL = 'https://api.trapiche.fun/meals';
const TOKEN = 'eyJraWQiOiJIbkxWVlVPQVlhMm02aHZTZHgrXC95Q1ZyWWozQmFnd2tmZzlEVFQ3bXo3dz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0NDc4MDQwOC1lMDUxLTcwZDctYTk5Mi1kZWJjZGJhZTQyZTIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV80OWViaXNhcUsiLCJjbGllbnRfaWQiOiI2MXYxbWdxOGR1ZjBsNHEwZGhsZzBlODJjYSIsIm9yaWdpbl9qdGkiOiJmYjM5MGExNi0yZTA2LTRmMGEtYjAwYS0wMGI0NGEzOWU3MjAiLCJpbnRlcm5hbElkIjoiMzFCVG50MTdYQ0ZwSGVmcVh0S3BSWE5XbWU1IiwiZXZlbnRfaWQiOiI1NjVjODg3YS1jNjY0LTQ1ZjItODIwZS04NTE5MGE0MzA2YjAiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzU0OTk2NjM3LCJleHAiOjE3NTUwMDAyMzcsImlhdCI6MTc1NDk5NjYzNywianRpIjoiMThiOWE5MDUtZGMwMS00ZDQ5LWIxMTEtNzFmZjQ0OGI0YzZiIiwidXNlcm5hbWUiOiI0NDc4MDQwOC1lMDUxLTcwZDctYTk5Mi1kZWJjZGJhZTQyZTIifQ.SgEt0bQJ0o6yFYT7Dbu6goBMQvKHakkMccLVnIHHhyIXjmb8AsPty4TsK6W6_ioexGRMJQgWykHEx3U1C2rU8gAs0B3nRdZUS5Snp0_p3KTFXOSY4wjmZG7Q4K0xT0TFcozjl1r4m6RBegeLr72ICzLxuyMBguLOh0Nzh4K_EZMfcPXdrH9Rm9sf07tUdY_aNWSPq14cnJJ4QdO2il13MCnbJ6DxKCDvK05cLlzeWjfBsfYu4pZHjtVs2xQmQeYXt5_ICjsFLhdfvStLyR0DYZ9ZNNmRs38godde5hCK-3_ZJCBXxYwbzbij-IaVgENbh8_7UGXDxucKmArvav2g8A';

interface IPresignResponse {
    uploadSignature: string;
}

interface IPresignDecoded {
    url: string;
    fields: Record<string, string>;
}

async function readImageFile(filePath: string): Promise<{
    data: Buffer;
    size: number;
    type: string;
}> {
    console.log(`🔍 Reading file from disk: ${filePath}`);
    const data = await fs.readFile(filePath);
    return {
        data,
        size: data.length,
        type: 'image/jpeg',
    };
}

async function createMeal(
    fileType: string,
    fileSize: number,
): Promise<IPresignDecoded> {
    console.log(`🚀 Requesting presigned POST for ${fileSize} bytes of type ${fileType}`);
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ file: { type: fileType, size: fileSize } }),
    });

    if (!res.ok) {
        throw new Error(`Failed to get presigned POST: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as IPresignResponse;
    const decoded = JSON.parse(
        Buffer.from(json.uploadSignature, 'base64').toString('utf-8'),
    ) as IPresignDecoded;

    console.log('✅ Received presigned POST data');
    return decoded;
}

function buildFormData(
    fields: Record<string, string>,
    fileData: Buffer,
    filename: string,
    fileType: string,
): FormData {
    console.log(`📦 Building FormData with ${Object.keys(fields).length} fields and file ${filename}`);
    const form = new FormData();
    for (const [key, value] of Object.entries(fields)) {
        form.append(key, value);
    }
    const blob = new Blob([fileData], { type: fileType });
    form.append('file', blob, filename);
    return form;
}

async function uploadToS3(url: string, form: FormData): Promise<void> {
    console.log(`📤 Uploading to S3 at ${url}`);
    const res = await fetch(url, {
        method: 'POST',
        body: form,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`S3 upload failed: ${res.status} ${res.statusText} — ${text}`);
    }

    console.log('🎉 Upload completed successfully');
}

async function uploadMealImage(filePath: string): Promise<void> {
    try {
        const { data, size, type } = await readImageFile(filePath);
        const { url, fields } = await createMeal(type, size);
        const form = buildFormData(fields, data, path.basename(filePath), type);
        await uploadToS3(url, form);
    } catch (err) {
        console.error('❌ Error during uploadMealImage:', err);
        throw err;
    }
}

uploadMealImage(
    path.resolve(__dirname, 'assets', 'potato.jpg'),
).catch(() => process.exit(1));
