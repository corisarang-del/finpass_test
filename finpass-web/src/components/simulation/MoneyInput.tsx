
import React from 'react';

interface MoneyInputProps {
    label?: string;
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    unit?: string;
    disabled?: boolean;
}

const MoneyInput: React.FC<MoneyInputProps> = ({
    label,
    value,
    onChange,
    placeholder,
    min = 0,
    max,
    className = '',
    unit = '원',
    disabled = false
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 콤마 제거 후 숫자만 추출
        const rawValue = e.target.value.replace(/,/g, '');

        // 빈 값 처리
        if (rawValue === '') {
            onChange(0);
            return;
        }

        // 숫자가 아닌 경우 무시 (소수점은 일단 제외, 정수만)
        if (!/^\d+$/.test(rawValue)) return;

        let numValue = parseInt(rawValue, 10);

        // Max/Min 제한 (입력 중에는 유연하게, blur 시점 처리는 상위에서 하거나 여기서 strict하게)
        // 여기서는 입력 가능한 최대값만 제한 (너무 큰 수 방지)
        if (max !== undefined && numValue > max) numValue = max;

        onChange(numValue);
    };

    const handleBlur = () => {
        // Min 값 보정은 Blur 시점에
        if (min !== undefined && value < min) {
            onChange(min);
        }
    };

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {label}
                </label>
            )}
            <div className="relative group">
                <input
                    type="text"
                    value={value > 0 ? value.toLocaleString() : ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder || '0'}
                    disabled={disabled}
                    className={`
                        w-full px-4 py-3 text-right pr-12
                        bg-white border text-gray-900 font-bold text-lg
                        rounded-xl transition-all duration-200
                        ${disabled
                            ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm hover:border-gray-300'
                        }
                    `}
                />
                <span className={`
                    absolute right-4 top-1/2 -translate-y-1/2 
                    text-sm font-medium pointer-events-none transition-colors
                    ${disabled ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-600'}
                `}>
                    {unit}
                </span>
            </div>
        </div>
    );
};

export default MoneyInput;
