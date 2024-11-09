// utils/units.ts
import { Unit } from '../types/units';

export const DEFAULT_BASE_SIZE = 16;

export const convertToPixels = (
  value: number, 
  unit: Unit, 
  baseSize: number = DEFAULT_BASE_SIZE
): number => {
  return unit === 'rem' ? value * baseSize : value;
};

// 필요한 경우 반대 변환 함수도 추가
export const convertToRems = (
  value: number, 
  unit: Unit, 
  baseSize: number = DEFAULT_BASE_SIZE
): number => {
  return unit === 'px' ? value / baseSize : value;
};

// 단위 변환을 위한 유틸리티 함수들을 여기에 추가
export const withUnit = (value: number, unit: Unit): string => {
  return `${value}${unit}`;
};