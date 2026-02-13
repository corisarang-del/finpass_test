
import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface ActionPlanCardProps {
    title: string;
    description: string;
    linkUrl?: string; // 쿠팡 파트너스 링크 등
    ctaText?: string;
    icon?: React.ReactNode;
    color?: string;
    image?: string; // 썸네일 있을 경우
    badges?: string[];
    highlight?: boolean;
}

const ActionPlanCard: React.FC<ActionPlanCardProps> = ({
    title,
    description,
    linkUrl,
    ctaText = "확인하러 가기",
    image,
    badges,
    highlight = false
}) => {
    return (
        <a
            href={linkUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`
                block relative overflow-hidden rounded-2xl p-6 transition-all duration-300
                ${highlight
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-indigo-200 shadow-xl scale-[1.02]'
                    : 'bg-white border border-gray-100 shadow-sm hover:shadow-md text-gray-900'}
            `}
        >
            {image && (
                <div className="absolute inset-0 z-0">
                    <img src={image} alt="" className="w-full h-full object-cover opacity-10" />
                </div>
            )}

            {highlight && (
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ArrowRight className="w-24 h-24 text-white rotate-[-45deg]" />
                </div>
            )}

            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                <div>
                    {badges && (
                        <div className="flex gap-2 mb-3">
                            {badges.map((badge, idx) => (
                                <span key={idx} className={`
                                    text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider
                                    ${highlight ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}
                                `}>
                                    {badge}
                                </span>
                            ))}
                        </div>
                    )}
                    <h3 className={`text-xl font-bold mb-2 ${highlight ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${highlight ? 'text-indigo-100' : 'text-gray-500'}`}>
                        {description}
                    </p>
                </div>

                <div className={`
                    flex items-center gap-2 text-sm font-bold mt-2
                    ${highlight ? 'text-white' : 'text-indigo-600'}
                `}>
                    {ctaText}
                    {linkUrl ? <ExternalLink className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </div>
            </div>
        </a>
    );
};

export default ActionPlanCard;
