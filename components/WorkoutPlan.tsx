
import React from 'react';
import type { Plan } from '../types';
import WorkoutBlock from './WorkoutBlock';

interface WorkoutPlanProps {
  plan: Plan;
}

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ plan }) => {
  return (
    <div className="space-y-8">
      {plan.bloques.map((bloque, index) => (
        <WorkoutBlock key={index} bloque={bloque} />
      ))}
    </div>
  );
};

export default WorkoutPlan;
