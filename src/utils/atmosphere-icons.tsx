
import React from 'react';
import { Home, Heart, Crown, Coffee, Flower } from 'lucide-react';

// Cozy and cute icons for restaurant atmospheres
export const CasualIcon = () => (
  <div className="animate-cozy-bounce">
    <Home className="w-8 h-8 text-cozy-peach" />
  </div>
);
export const TrendyIcon = () => (
  <div className="animate-cozy-wiggle">
    <Heart className="w-8 h-8 text-cozy-pink" />
  </div>
);
export const ElegantIcon = () => (
  <div className="animate-cozy-glow">
    <Crown className="w-8 h-8 text-cozy-warm" />
  </div>
);
export const UniqueIcon = () => (
  <div className="animate-cozy-bounce delay-300">
    <Coffee className="w-8 h-8 text-cozy-peach" />
  </div>
);
export const QuietIcon = () => (
  <div className="animate-cozy-wiggle delay-150">
    <Flower className="w-8 h-8 text-cozy-pink" />
  </div>
);
