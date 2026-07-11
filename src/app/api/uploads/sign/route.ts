import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { slugify } from "@/lib/cms";
import {
  createSupabaseAdminClient,
  getSupabaseStorageBucket,
  isSupabaseStorageConfigured
} from "@/lib/supabase-server";

export const runtime = "nodejs";

type SignRequestFile = { name: string };

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Inicia sesión para subir imágenes." }, { status: 401 });
  }

  if (!isSupabaseStorageConfigured()) {
    return NextResponse.json({ configured: false });
  }

  const body = await request.json().catch(() => null);
  const files: SignRequestFile[] = Array.isArray(body?.files) ? body.files : [];
  const title = typeof body?.title === "string" && body.title ? body.title : "propiedad";

  if (!files.length) {
    return NextResponse.json({ message: "No se enviaron archivos." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const bucket = getSupabaseStorageBucket();
  const slug = slugify(title);

  try {
    const uploads = await Promise.all(
      files.map(async (file, index) => {
        const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : ".png";
        const path = `properties/${slug}-${Date.now()}-${index}${extension}`;

        const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path);
        if (error || !data) {
          throw new Error(error?.message ?? "No se pudo preparar la subida.");
        }

        const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path);

        return { path, token: data.token, publicUrl: publicUrl.publicUrl };
      })
    );

    return NextResponse.json({ configured: true, bucket, uploads });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo preparar la subida de imágenes.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
