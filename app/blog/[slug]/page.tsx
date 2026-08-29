import { getPostData, getSortedPostsData } from '@/lib/blog';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const postData = await getPostData(resolvedParams.slug);
    return {
      title: postData.title,
      description: postData.excerpt,
      alternates: {
        canonical: `/blog/${resolvedParams.slug}`,
      },
    };
  } catch (e) {
    return {
      title: 'Article introuvable',
    };
  }
}

export default async function BlogPost({ params }: Props) {
  const resolvedParams = await params;
  let postData;
  
  try {
    postData = await getPostData(resolvedParams.slug);
  } catch (e) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-craie pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <Link href="/blog" className="inline-flex items-center text-sm font-body text-azur hover:text-encre transition-colors mb-8">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour au blog
        </Link>
        
        <header className="mb-12">
          <div className="text-sm font-mono text-azur mb-4">
            {new Date(postData.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-encre mb-6 leading-tight">
            {postData.title}
          </h1>
          <p className="font-body text-xl text-ardoise/80 leading-relaxed">
            {postData.excerpt}
          </p>
        </header>

        <div 
          className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:text-encre prose-a:text-azur hover:prose-a:text-encre prose-strong:text-encre marker:text-solaire"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }}
        />

        <hr className="my-12 border-encre/10" />

        <div className="bg-gradient-to-br from-[#040e21] to-encre rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
          <h3 className="font-display text-3xl mb-4 relative z-10">Prêt à exceller avec GTS ?</h3>
          <p className="font-body text-white/70 mb-8 max-w-xl mx-auto relative z-10">
            Rejoignez nos groupes WhatsApp pour des cours en direct, des corrections détaillées et un accompagnement 7j/7 jusqu'au Bac et aux concours.
          </p>
          <a href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-solaire text-encre font-display font-medium rounded-full hover:bg-white transition-colors duration-200 relative z-10">
            Rejoindre un cours maintenant
          </a>
        </div>
      </div>
    </article>
  );
}
