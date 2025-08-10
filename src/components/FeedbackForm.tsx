import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/utils/toast";
import { submitFeedback } from "@/integrations/supabase/feedback";

type Props = {
  orderId: string;
  userId: string;
  onSubmitted?: () => void;
};

const FeedbackForm: React.FC<Props> = ({ orderId, userId, onSubmitted }) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitFeedback({
        order_id: orderId,
        user_id: userId,
        rating,
        comment,
      });
      showSuccess("Thank you for your feedback!");
      setComment("");
      if (onSubmitted) onSubmitted();
    } catch {
      showError("Failed to submit feedback.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 bg-gray-50 p-4 rounded">
      <div className="mb-2 font-semibold">Rate your order:</div>
      <div className="flex gap-1 mb-2">
        {[1,2,3,4,5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
            onClick={() => setRating(star)}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >★</button>
        ))}
      </div>
      <textarea
        className="w-full border rounded p-2 mb-2"
        placeholder="Leave a comment (optional)"
        value={comment}
        onChange={e => setComment(e.target.value)}
        rows={2}
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
};

export default FeedbackForm;