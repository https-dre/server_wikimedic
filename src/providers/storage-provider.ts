import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { BadResponse } from "../error-handler";
import path from "path";
import { randomUUID } from "crypto";

export class StorageProvider {
  private supabase: SupabaseClient;
  constructor(private bucket: string) {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_KEY!;

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadFile(
    originalName: string,
    file: Buffer | Uint8Array,
    contentType: string
  ): Promise<{ url: string; filename: string }> {
    let ext = path.extname(originalName).toLowerCase();
    if (!ext) {
      ext = ".bin";
    }

    const filename = `${randomUUID()}${ext}`;
    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filename, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw new BadResponse(
        {
          details: "Erro no upload do arquivo",
          error: `SupabaseError: ${error}`,
        },
        500
      );
    }

    return {
      url: this.getPublicUrl(filename),
      filename,
    };
  }

  getPublicUrl(path: string): string {
    const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
