// ================================================================
// Shreedha Vastra — Product Reviews (list + add review form)
// ================================================================
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiImage, FiX } from 'react-icons/fi';
import StarRating from '../common/StarRating';
import productService from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';

const MAX_IMAGES = 4;

const Reviews = ({ productId }) => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const loadReviews = async () => {
    setLoading(true);
    try {
      const { reviews } = await productService.getReviews(productId);
      setReviews(reviews);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const combined = [...images, ...files].slice(0, MAX_IMAGES);
    setImages(combined);
    setPreviews(combined.map((f) => URL.createObjectURL(f)));
    e.target.value = '';
  };

  const removeImage = (index) => {
    const nextImages = images.filter((_, i) => i !== index);
    setImages(nextImages);
    setPreviews(nextImages.map((f) => URL.createObjectURL(f)));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('comment', data.comment);
      images.forEach((file) => formData.append('images', file));

      await productService.addReview(productId, formData);
      toast.success('Review submitted. Thank you!');
      reset();
      setRating(5);
      setImages([]);
      setPreviews([]);
      loadReviews();
    } catch {
      // errors already toasted globally by the axios interceptor
    }
  };

  return (
    <div className="mt-12">
      <h3 className="font-serif text-2xl mb-6">Customer Reviews</h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-5 rounded-2xl bg-beige/30 space-y-4">
          <div>
            <span className="text-sm font-medium block mb-2">Your Rating</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setRating(n)} aria-label={`Rate ${n} stars`}>
                  <StarRating rating={n <= rating ? 1 : 0} size={22} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <textarea
              {...register('comment', { required: 'Please share a few words about the product' })}
              rows={3}
              placeholder="Share your experience with this product..."
              className="input-field"
            />
            {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>}
          </div>

          <div>
            <span className="text-sm font-medium block mb-2">Add Photos (optional)</span>
            <div className="flex flex-wrap gap-3">
              {previews.map((src, i) => (
                <div key={src} className="relative w-16 h-16">
                  <img src={src} alt={`Upload preview ${i + 1}`} className="w-16 h-16 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-charcoal text-ivory rounded-full flex items-center justify-center"
                    aria-label="Remove image"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <label className="w-16 h-16 rounded-lg border-2 border-dashed border-beige flex items-center justify-center cursor-pointer hover:border-gold">
                  <FiImage className="text-charcoal/40" />
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={handleImageSelect} />
                </label>
              )}
            </div>
            <p className="text-xs text-charcoal/40 mt-1">Up to {MAX_IMAGES} photos, 5MB each.</p>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-charcoal/60 mb-8">Please log in to write a review.</p>
      )}

      {loading ? (
        <p className="text-sm text-charcoal/50">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-charcoal/50">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((r) => (
            <div key={r._id} className="border-b border-beige pb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{r.user?.name || r.name}</span>
                <span className="text-xs text-charcoal/40">{formatDate(r.createdAt)}</span>
              </div>
              <StarRating rating={r.rating} size={14} />
              {r.isVerifiedPurchase && (
                <span className="text-xs text-gold-dark font-medium block mt-1">Verified Purchase</span>
              )}
              <p className="text-sm mt-2 text-charcoal/80 dark:text-ivory/80">{r.comment}</p>
              {r.images?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {r.images.map((img) => (
                    <img
                      key={img.public_id || img.url}
                      src={img.url}
                      alt="Customer review"
                      className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                      onClick={() => window.open(img.url, '_blank')}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;