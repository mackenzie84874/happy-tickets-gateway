
import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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

  console.log("StarRating mounted with initialRating:", initialRating);

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

  const handleSubmit = () => {
    if (rating > 0 && !hasSubmitted) {
      handleStarClick(rating);
    } else if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Click on a star to provide your rating.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        {hasSubmitted 
          ? <p className="text-green-600 font-medium">Thank you for your {rating}-star rating!</p> 
          : <p className="text-gray-700">Please rate your support experience</p>}
      </div>
      
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={cn(
              "h-10 w-10 cursor-pointer transition-all duration-200", 
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
      
      {!hasSubmitted && (
        <div className="flex justify-center">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6"
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default StarRating;
