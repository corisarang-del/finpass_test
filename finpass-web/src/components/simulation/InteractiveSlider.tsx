
import React from 'react';
import MoneyInput from './MoneyInput';

interface InteractiveSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    unit?: string;
    description?: string;
    color?: string; // hex color for accent
}

const InteractiveSlider: React.FC<InteractiveSliderProps> = ({
    label,
    value,
    min,
    max,
    step = 1,
    onChange,
    unit = '원',
    description,
    color = '#4F46E5' // Indigo-600
}) => {
    // 배경 그라데이션 계산 (슬라이더 진행률)
    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

    return (
        <div className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Header: Label & Input */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-gray-900 font-bold flex items-center gap-2">
                        {label}
                    </h3>
                    {description && (
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                    )}
                </div>

                {/* MoneyInput for precise control */}
                <div className="w-32">
                    <MoneyInput
                        value={value}
                        onChange={onChange}
                        min={min}
                        max={max}
                        unit={unit}
                        className="scale-90 origin-right" // Slightly smaller input
                    />
                </div>
            </div>

            {/* Slider Track */}
            <div className="relative h-6 flex items-center">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="
                        w-full h-2 rounded-lg appearance-none cursor-pointer
                        focus:outline-none focus:ring-0
                        bg-gray-100
                    "
                    style={{
                        // 동적 그라데이션 (Webkit, Moz 호환성을 위해 JS로 처리하거나 별도 스타일 태그 필요하지만, 간단히 background로 처리)
                        background: `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #F3F4F6 ${percentage}%, #F3F4F6 100%)`
                    }}
                />

                {/* Thumb Customization (Global CSS or Tailwind Plugin is better, but inline style works for basics) */}
                <style>{`
                    input[type=range]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: #ffffff;
                        border: 2px solid ${color};
                        cursor: pointer;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                        transition: transform 0.1s;
                        margin-top: -6px; /* center thumb */
                    }
                    input[type=range]::-webkit-slider-thumb:hover {
                        transform: scale(1.1);
                    }
                    input[type=range]::-webkit-slider-runnable-track {
                        width: 100%;
                        height: 6px;
                        cursor: pointer;
                        border-radius: 9999px;
                    }
                `}</style>
            </div>

            {/* Scale Labels */}
            <div className="flex justify-between mt-2 text-xs font-medium text-gray-400 select-none">
                <span>{min.toLocaleString()}{unit}</span>
                <span>{((min + max) / 2).toLocaleString()}{unit}</span>
                <span>{max.toLocaleString()}{unit}</span>
            </div>
        </div>
    );
};

export default InteractiveSlider;
