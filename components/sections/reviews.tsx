import { Star, ExternalLink } from "lucide-react";
import type { Customer, ReviewHighlight } from "@/lib/types";

interface ReviewsProps {
  customer: Pick<Customer, "name" | "config">;
}

function ReviewCard({ review }: { review: ReviewHighlight }) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/60 shadow-sm hover:shadow-lg transition-shadow">
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-neutral-200"}`}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-neutral-700 leading-relaxed mb-6">
        &ldquo;{review.text}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700">
            {review.author.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-neutral-800">{review.author}</div>
            <div className="text-xs text-neutral-400">via {review.source}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Reviews({ customer }: ReviewsProps) {
  const reviews = customer.config.review_highlights ?? [];
  const rating = customer.config.google_rating;
  const count = customer.config.google_review_count;

  if (reviews.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
            Das sagen unsere Kunden
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
            Vertrauen durch Qualität
          </h2>
          {rating && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-neutral-200"}`}
                  />
                ))}
              </div>
              <span className="text-lg font-bold text-neutral-800">{rating}</span>
              <span className="text-neutral-400">({count} Bewertungen auf Google)</span>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Alle Bewertungen auf Google ansehen
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
