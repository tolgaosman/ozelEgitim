import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PageContentBlockForm } from "@/components/admin/page-content/page-content-block-form";
import { findPageGroup } from "@/lib/admin/page-content-config";
import { adminGet } from "@/lib/admin/client";
import type { PageContent } from "@/lib/schemas/page-content";

type PageContentsResponse = { data: PageContent; meta: { customizedKeys: string[] } };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: findPageGroup(slug)?.label ?? "Sayfa İçeriği" };
}

export default async function PageContentGroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const group = findPageGroup(slug);
  if (!group) notFound();

  const { data: allContent, meta } = await adminGet<PageContentsResponse>("/api/admin/page-contents");

  return (
    <div className="space-y-6">
      <Link href="/admin/sayfalar" className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-ink">
        <ArrowLeft className="size-4" />
        Sayfalara dön
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{group.label}</h1>
          <p className="mt-1 text-sm text-ink-soft">{group.description}</p>
        </div>
        {group.sitePath ? (
          <Link
            href={group.sitePath}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-800 hover:underline"
          >
            Sitede gör <ExternalLink className="size-3.5" />
          </Link>
        ) : null}
      </div>

      <div className="space-y-4">
        {group.blocks.map((blockConfig) => (
          <PageContentBlockForm
            key={blockConfig.key}
            config={blockConfig}
            content={allContent[blockConfig.key]}
            isCustomized={meta.customizedKeys.includes(blockConfig.key)}
          />
        ))}
      </div>
    </div>
  );
}
