'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface ReviewFormProps {
  projectId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ projectId, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please enter a comment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload images first if any
      let uploadedImageUrls: string[] = [];
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach(image => {
          formData.append('images', image);
        });

        const uploadResponse = await axios.post('/api/uploads/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        uploadedImageUrls = uploadResponse.data.imageUrls || [];
      }

      // Submit review
      await axios.post(`/api/reviews/project/${projectId}`, {
        rating,
        comment,
        images: uploadedImageUrls
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Reset form
      setRating(0);
      setComment('');
      setImages([]);
      setImagePreviews([]);

      onReviewSubmitted();
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600">Please login to write a review</p>
      </div>
    );
  }

  return (
    <div className="review-form">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full text-left py-4 px-6 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 border border-slate-200 rounded-xl transition-all duration-200 flex items-center justify-between group shadow-sm hover:shadow-md"
          aria-expanded="false"
          aria-controls="review-form"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <span className="text-slate-900 font-semibold block">Write a Review</span>
              <span className="text-slate-600 text-sm">Share your experience with this project</span>
            </div>
          </div>
          <svg
            className="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Write a Review</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-6">
              <label className="block text-sm font-medium text-black mb-3">Rating:</label>
              <select
                id="review-rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
                className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-black bg-white"
              >
                <option value="" className="text-black">Select Rating</option>
                <option value="5" className="text-black">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4" className="text-black">⭐⭐⭐⭐ Very Good</option>
                <option value="3" className="text-black">⭐⭐⭐ Good</option>
                <option value="2" className="text-black">⭐⭐ Fair</option>
                <option value="1" className="text-black">⭐ Poor</option>
              </select>
            </div>

            <div className="form-group mb-6">
              <label className="block text-sm font-medium text-black mb-3">Comment:</label>
              <textarea
                id="review-comment"
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="Share your experience with this project..."
                className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors resize-none text-black placeholder:text-gray-600 bg-white"
              />
            </div>

            <div className="form-group mb-6">
              <label className="block text-sm font-medium text-black mb-3">Images (optional):</label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-50 file:text-black hover:file:bg-slate-100 bg-white"
                />
                <p className="text-sm text-black">Maximum 5 images, each up to 5MB</p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-black rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-slate-800 text-white py-3 px-6 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-6 py-3 border border-black text-black rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium bg-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}