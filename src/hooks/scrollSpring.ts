/** Exact critically damped spring step; velocity persists between scroll events. */
export function stepScrollSpring(position: number, velocity: number, target: number, seconds: number) {
  const frequency = 36;
  const offset = position - target;
  const decay = Math.exp(-frequency * seconds);
  const coefficient = velocity + frequency * offset;
  return {
    position: target + (offset + coefficient * seconds) * decay,
    velocity: (velocity - frequency * coefficient * seconds) * decay,
  };
}
