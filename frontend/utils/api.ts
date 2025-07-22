interface RuntimeConfig {
  public: Record<string, string>;
}

interface FileUploadResponse {
  uploadUrl: string;
  fileKey: string;
}

export interface Transcription {
  createdAt: string;
  SK: string;
  transcription_name: string;
  PK: string;
  updatedAt: string;
  file_key: string;
  text?: string;
}

interface getTranscriptionsResponse {
  transcriptions: Transcription[];
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function getApiUrl(name: keyof RuntimeConfig["public"]): string {
  const config = useRuntimeConfig() as { public: Record<string, string> };
  const url = config.public[name];
  return url;
}

export async function getPresignedUrl(
  token: string,
  data: { fileName: string; fileType: string }
): Promise<ApiResponse<FileUploadResponse>> {
  const api = getApiUrl("NUXT_LAMBDA_FUNCTION_UPLOAD");
  const response = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body?.error || "Erro ao obter URL de upload.");
  }

  const responseData =
    (await response.json()) as ApiResponse<FileUploadResponse>;
  return responseData;
}

export async function uploadToS3(uploadUrl: string, file: File) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao enviar o arquivo para o S3.");
  }
}

export async function createTranscription(
  token: string,
  payload: {
    transcription_name: string;
    file_key: string;
  }
) {
  try {
    const api = getApiUrl("NUXT_LAMBDA_FUNCTION_CREATE_TRANSCRIPTION");
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json();
      throw new Error(body?.error || "Erro ao obter URL de upload.");
    }

    const responseData =
      (await response.json()) as ApiResponse<FileUploadResponse>;
    return responseData;
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message || "Erro desconhecido",
    };
  }
}

export async function getTranscriptions(token: string) {
  const api = getApiUrl("NUXT_LAMBDA_FUNCTION_GET_TRANSCRIPTIONS");
  const response = await fetch(api, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body?.error || "Erro ao obter transcrições.");
  }

  const responseData =
    (await response.json()) as ApiResponse<getTranscriptionsResponse>;
  return responseData;
}
