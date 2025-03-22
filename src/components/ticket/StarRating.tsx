
import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
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
      // Save rating to Supabase with a type assertion to bypass TypeScript error
      const { error } = await supabase
        .from('tickets')
        .update({ 
          rating: value 
        } as any)
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
    <div className="space-y-2">
      <div className="text-sm font-medium">
        {hasSubmitted 
          ? `Thank you for your ${rating}-star rating!` 
          : "How would you rate our support?"}
      </div>
      
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={cn(
              "h-8 w-8 cursor-pointer transition-colors", 
              (hoveredRating >= value || (!hoveredRating && rating >= value))
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300",
              hasSubmitted && "cursor-default"
            )}
            onMouseEnter={() => !hasSubmitted && setHoveredRating(value)}
            onMouseLeave={() => !hasSubmitted && setHoveredRating(0)}
            onClick={() => !hasSubmitted && handleStarClick(value)}
          />
        ))}
        
        {isSubmitting && (
          <span className="ml-2 text-sm text-primary animate-pulse">
            Submitting...
          </span>
        )}
      </div>
    </div>
  );
};

export default StarRating;
