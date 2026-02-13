
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Lightbulb, ThumbsUp, MessageCircle } from 'lucide-react';
import type { ExpertAdvice } from '../../hooks/useExpertAdvisor';
import React from 'react'; // React import 추가

interface ExpertPopupProps {
    advice: ExpertAdvice | null; // 현재 가장 중요한 조언 1개
    isVisible?: boolean;
    onClose?: () => void;
}

const ExpertPopup: React.FC<ExpertPopupProps> = ({ advice, isVisible = true, onClose }) => {
    // advice가 바뀔 때마다 팝업을 다시 보여주기 위해 내부 state 관리 또는 key prop 활용
    // 상위에서 advice가 바뀌면 자동으로 리렌더링되므로 key를 활용

    // 자동 닫힘 타이머 (선택사항 - 사용자가 귀찮아할 수 있으므로)
    // useEffect(() => {
    //     if (advice) {
    //         const timer = setTimeout(onClose, 8000);
    //         return () => clearTimeout(timer);
    //     }
    // }, [advice, onClose]);

    if (!advice || !isVisible) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'tip': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
            case 'praise': return <ThumbsUp className="w-5 h-5 text-green-500" />;
            default: return <MessageCircle className="w-5 h-5 text-indigo-500" />;
        }
    };

    const getBorderColor = (type: string) => {
        switch (type) {
            case 'warning': return 'border-orange-200 bg-orange-50';
            case 'tip': return 'border-yellow-200 bg-yellow-50';
            case 'praise': return 'border-green-200 bg-green-50';
            default: return 'border-indigo-200 bg-indigo-50';
        }
    };

    return (
        <AnimatePresence mode="wait">
            {advice && (
                <motion.div
                    key={advice.id} // advice ID가 바뀌면 애니메이션 재실행
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-6 right-6 z-50 w-full max-w-[360px] md:max-w-[400px]"
                >
                    <div className="relative">
                        {/* 말풍선 꼬리 (Optional) */}
                        {/* <div className="absolute -bottom-2 right-10 w-4 h-4 bg-white transform rotate-45 border-b border-r border-gray-200"></div> */}

                        <div className={`
                            relative flex flex-col gap-3 p-5 pr-8
                            bg-white rounded-2xl shadow-xl border-2
                            ${getBorderColor(advice.type).split(' ')[0]}
                            backdrop-blur-sm bg-opacity-95
                        `}>
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Header: Agent Info */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img
                                        src={advice.agentImage}
                                        alt={advice.agentName}
                                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover bg-gray-100"
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                                        {getIcon(advice.type)}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-bold text-gray-900">{advice.agentName}</h4>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide
                                            ${advice.type === 'warning' ? 'bg-orange-100 text-orange-700' :
                                                advice.type === 'tip' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                            }
                                        `}>
                                            {advice.agentRole}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">실시간 분석 중...</p>
                                </div>
                            </div>

                            {/* Message Body */}
                            <div className={`
                                p-3 rounded-xl text-sm font-medium leading-relaxed
                                ${getBorderColor(advice.type)}
                                ${advice.type === 'warning' ? 'text-orange-900' :
                                    advice.type === 'tip' ? 'text-yellow-900' :
                                        'text-green-900'
                                }
                            `}>
                                "{advice.message}"
                            </div>

                            {/* Action CTA (Optional) */}
                            {/* <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 self-end flex items-center gap-1">
                                자세히 보기 <ArrowRight className="w-3 h-3" />
                            </button> */}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ExpertPopup;
