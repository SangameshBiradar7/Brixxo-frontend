'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
}

interface ReviewListProps {
  projectId: string;
}

export default function ReviewList({ projectId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReviews();
  }, [projectId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reviews/project/${projectId}`);
      setReviews(response.data);
    } catch (err: any) {
      console.error('Error loading reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-black">{rating}/5</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-black">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-black">No reviews yet. Be the first to review this project!</p>
      </div>
    );
  }

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Customer Reviews</h3>
            <p className="text-slate-600 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''} • Average rating</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-900 mb-1">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center mb-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-sm text-slate-600">out of 5</div>
          </div>
        </div>
      </div>

      {reviews.map((review) => (
        <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-black font-medium">
                  {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-black">{review.user?.name || 'Anonymous User'}</h4>
                <p className="text-sm text-black">{formatDate(review.createdAt)}</p>
              </div>
            </div>
            {renderStars(review.rating)}
          </div>

          <p className="text-black mb-4 leading-relaxed">{review.comment}</p>

          {review.images && review.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => window.open(image, '_blank')}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}