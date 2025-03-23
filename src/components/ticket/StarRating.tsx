
import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StarRatingProps {
  ticketId: string;
  initialRating?: number;
  onRatingSubmit?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  ticketId, 
  initialRating = 0,
  onRatingSubmit 
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(initialRating > 0);
  const { toast } = useToast();

  const handleStarClick = async (value: number) => {
    if (hasSubmitted) return;
    
    setRating(value);
    setIsSubmitting(true);

    try {
      console.log(`Submitting rating ${value} for ticket ${ticketId}`);
      
      // Save rating to Supabase
      const { error } = await supabase
        .from('tickets')
        .update({ rating: value })
        .eq('id', ticketId);

      if (error) {
        throw error;
      }

      // Call the callback if provided
      if (onRatingSubmit) {
        onRatingSubmit(value);
      }

      setHasSubmitted(true);
      toast({
        title: "Rating submitted",
        description: `Thank you for rating our support with ${value} ${value === 1 ? 'star' : 'stars'}.`,
      });
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Error submitting rating",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3 bg-secondary/50 p-4 rounded-lg border">
      <div className="text-sm font-medium text-center">
        {hasSubmitted 
          ? `Thank you for your ${rating}-star rating!` 
          : "How would you rate our support?"}
      </div>
      
      <div className="flex items-center justify-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={cn(
              "h-8 w-8 cursor-pointer transition-all duration-200", 
              (hoveredRating >= value || (!hoveredRating && rating >= value))
                ? "text-yellow-400 fill-yellow-400 scale-110" 
                : "text-gray-300",
              hasSubmitted ? "cursor-default" : "hover:scale-125"
            )}
            onMouseEnter={() => !hasSubmitted && setHoveredRating(value)}
            onMouseLeave={() => !hasSubmitted && setHoveredRating(0)}
            onClick={() => !hasSubmitted && handleStarClick(value)}
          />
        ))}
      </div>
      
      {isSubmitting && (
        <div className="text-center">
          <span className="text-sm text-primary animate-pulse">
            Submitting...
          </span>
        </div>
      )}
    </div>
  );
};

export default StarRating;
