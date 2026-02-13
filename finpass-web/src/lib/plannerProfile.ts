export interface PlanInputs {
  retirementAge: number;
  targetMonthlyExpense: number;
  initialNetWorth: number;
  monthlyIncome: number;
  monthlyExpense: number;
  investmentReturnRate: number;
}

export interface GuideProfile {
  name: string;
  role: string;
  key: string;
}

export interface AnswerInsight {
  id: string;
  label: string;
  value: string;
  interpretation: string;
  impact: string;
}

const BASE_BY_CATEGORY: Record<string, PlanInputs> = {
  'real-estate': {
    retirementAge: 45,
    targetMonthlyExpense: 3000000,
    initialNetWorth: 150000000,
    monthlyIncome: 6000000,
    monthlyExpense: 3500000,
    investmentReturnRate: 7,
  },
  insurance: {
    retirementAge: 50,
    targetMonthlyExpense: 2500000,
    initialNetWorth: 80000000,
    monthlyIncome: 4500000,
    monthlyExpense: 2800000,
    investmentReturnRate: 5,
  },
  stock: {
    retirementAge: 45,
    targetMonthlyExpense: 3500000,
    initialNetWorth: 90000000,
    monthlyIncome: 5500000,
    monthlyExpense: 3000000,
    investmentReturnRate: 9,
  },
  'life-balance': {
    retirementAge: 50,
    targetMonthlyExpense: 3000000,
    initialNetWorth: 120000000,
    monthlyIncome: 5000000,
    monthlyExpense: 3200000,
    investmentReturnRate: 7,
  },
};

export const GUIDE_PROFILES: Record<string, GuideProfile> = {
  'real-estate': { name: '에이전트 한', role: '부동산 전략', key: 'han' },
  insurance: { name: '에이전트 송', role: '기초자산 설계', key: 'song' },
  stock: { name: '에이전트 최', role: '투자 분석', key: 'choi' },
  'life-balance': { name: '에이전트 유', role: '라이프 밸런스', key: 'you' },
};

const toNumber = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const has = (answers: Record<string, unknown>, key: string, target: string) => String(answers[key] ?? '') === target;

export const derivePlanInputsFromAnswers = (categoryId: string, answers: Record<string, unknown>): PlanInputs => {
  const base = BASE_BY_CATEGORY[categoryId] ?? BASE_BY_CATEGORY['real-estate'];
  const result: PlanInputs = { ...base };

  const valueType = String(answers.c3 ?? '');
  if (valueType === '성장') {
    result.investmentReturnRate += 1;
  } else if (valueType === '안정') {
    result.investmentReturnRate -= 1;
    result.retirementAge += 3;
  } else if (valueType === '자유') {
    result.retirementAge -= 3;
    result.targetMonthlyExpense += 200000;
  } else if (valueType === '건강') {
    result.targetMonthlyExpense += 300000;
    result.monthlyExpense += 200000;
  }

  if (categoryId === 'real-estate') {
    if (has(answers, 'r1', '매매')) {
      result.targetMonthlyExpense += 300000;
      result.monthlyExpense += 200000;
    }
    if (has(answers, 'r3', '150만원 이상')) {
      result.monthlyExpense += 400000;
    } else if (has(answers, 'r3', '50만원 이하')) {
      result.monthlyExpense -= 200000;
    }
    if (has(answers, 'r6', '청약')) {
      result.retirementAge -= 1;
    }
  }

  if (categoryId === 'insurance') {
    if (has(answers, 'i1', '없음')) {
      result.initialNetWorth -= 15000000;
      result.monthlyExpense += 150000;
    } else if (has(answers, 'i1', '6개월 이상')) {
      result.initialNetWorth += 15000000;
    }

    if (has(answers, 'i5', '있다')) {
      result.monthlyExpense -= 120000;
    }

    if (has(answers, 'i3', '잘 되고 있음')) {
      result.retirementAge -= 1;
    }
  }

  if (categoryId === 'stock') {
    const risk = String(answers.s2 ?? '');
    if (risk === '매우 낮음' || risk === '낮음') {
      result.investmentReturnRate = 5;
    } else if (risk === '높음') {
      result.investmentReturnRate = 10;
    }

    const investPower = String(answers.s4 ?? '');
    if (investPower === '50만원 이상') {
      result.monthlyExpense -= 300000;
    } else if (investPower === '10만원 이하') {
      result.monthlyExpense += 150000;
    }
  }

  if (categoryId === 'life-balance') {
    const due = String(answers.l2 ?? '');
    if (due === '1년 이내') result.retirementAge = 40;
    if (due === '3년 이내') result.retirementAge = 45;
    if (due === '5년 이내') result.retirementAge = 50;
    if (due === '10년 이내') result.retirementAge = 60;

    const reduceItem = String(answers.l3 ?? '');
    if (reduceItem !== '' && reduceItem !== '없음') {
      result.monthlyExpense -= 120000;
    }
  }

  result.retirementAge = clamp(result.retirementAge, 40, 65);
  result.targetMonthlyExpense = clamp(result.targetMonthlyExpense, 1800000, 9000000);
  result.initialNetWorth = clamp(result.initialNetWorth, 10000000, 500000000);
  result.monthlyIncome = clamp(result.monthlyIncome, 1500000, 15000000);
  result.monthlyExpense = clamp(result.monthlyExpense, 1000000, 12000000);
  result.investmentReturnRate = clamp(result.investmentReturnRate, 3, 12);

  const age = toNumber(answers.c2, 29);
  if (result.retirementAge <= age) {
    result.retirementAge = clamp(age + 5, 40, 65);
  }

  return result;
};

export const getResultGuideComment = (categoryId: string, answers: Record<string, unknown>) => {
  if (categoryId === 'real-estate') {
    const housing = String(answers.r1 ?? '');
    if (housing === '매매') return '매매를 고려하고 계시므로, 월 상환 여력을 우선 안정적으로 잡아드리겠습니다.';
    if (housing === '전세') return '전세 전략을 선택하셨으니, 종잣돈 축적 속도를 중심으로 계산해드리겠습니다.';
    return '주거 전략이 흔들리지 않도록 목표 자산과 월 현금흐름을 함께 맞춰드리겠습니다.';
  }

  if (categoryId === 'insurance') {
    const emergency = String(answers.i1 ?? '');
    if (emergency === '없음') return '비상자금이 없는 상태라서, 먼저 방어 자산을 확보하는 시나리오로 계산해드리겠습니다.';
    return '보장과 현금흐름의 균형을 맞춰서 장기적으로 버틸 수 있는 구조로 잡아드리겠습니다.';
  }

  if (categoryId === 'stock') {
    const risk = String(answers.s2 ?? '');
    if (risk === '매우 낮음' || risk === '낮음') return '변동성 허용 범위를 낮게 잡으셔서, 보수적인 수익률 기준으로 시뮬레이션하겠습니다.';
    if (risk === '높음') return '공격 성향을 반영해 기대수익률을 높게 두되, 손실 방어 구간도 함께 보겠습니다.';
    return '투자 성향을 기준으로 무리하지 않는 복리 경로를 제안드리겠습니다.';
  }

  const goal = String(answers.l1 ?? '');
  if (goal) return `선택하신 목표(${goal})를 우선순위로 두고, 지출 조정과 은퇴 시점을 함께 맞춰드리겠습니다.`;
  return '삶의 목표와 자산 계획이 함께 맞물리도록 현실적인 경로를 제안드리겠습니다.';
};

export const getSimulationGuideComment = (
  categoryId: string,
  answers: Record<string, unknown>,
  metric: { achievementRate: number; fiAge: number | null; currentAge: number; targetAsset: number },
) => {
  if (metric.fiAge === null) {
    return '현재 조건으로는 목표 시점 도달이 어려워 보입니다. 지출 조정 항목을 적용해 흐름을 먼저 개선해보시죠.';
  }

  const years = metric.fiAge - metric.currentAge;
  if (categoryId === 'real-estate') {
    return `부동산 목표를 고려하면 약 ${years}년 후에 경제적 자유 구간에 들어가실 수 있습니다. 주거 자금과 비상자금 분리를 권장드립니다.`;
  }

  if (categoryId === 'insurance') {
    return `현재 추세라면 ${years}년 후 안정 구간에 진입 가능합니다. 고정비 점검을 병행하시면 도달 속도를 더 높이실 수 있습니다.`;
  }

  if (categoryId === 'stock') {
    const theme = String(answers.s5 ?? '핵심 자산');
    return `${theme} 관심도를 반영해 계산한 결과, 약 ${years}년 후 목표 구간에 접근 가능합니다. 분산 비중만 유지하시면 안정적입니다.`;
  }

  return `선택하신 라이프 목표를 기준으로 약 ${years}년 후 달성이 가능해 보입니다. 루틴형 절약을 유지하시면 더 빨라질 수 있습니다.`;
};

export const getFinalGuideComment = (categoryId: string, answers: Record<string, unknown>) => {
  if (categoryId === 'real-estate') {
    const strategy = String(answers.r6 ?? '주거 전략');
    return `${strategy} 방향으로 진행하시되, 첫 2주 동안은 지출 조정과 비상자금 분리부터 실행하시면 좋겠습니다.`;
  }
  if (categoryId === 'insurance') {
    return '보장 점검과 현금흐름 정리를 먼저 진행하시면, 이후 투자/저축 계획이 훨씬 안정적으로 유지됩니다.';
  }
  if (categoryId === 'stock') {
    return '핵심 ETF 중심 비중을 먼저 고정하시고, 관심 테마는 보조 비중으로 관리하시면 장기 성과가 좋아집니다.';
  }
  const habit = String(answers.l3 ?? '절약 루틴');
  return `${habit}부터 실행하시고 월간 리뷰를 붙이시면, 목표 시점이 실제로 앞당겨질 가능성이 높습니다.`;
};

const QUESTION_LABELS: Record<string, string> = {
  c1: '이름',
  c2: '현재 나이',
  c3: '중요 가치',
  r1: '주거 형태',
  r2: '입지 우선순위',
  r3: '월 상환 가능액',
  r4: '매매 전환 의향',
  r5: '걱정 변수',
  r6: '선호 전략',
  i1: '비상금 수준',
  i2: '보험 목적 이해도',
  i3: '연금 준비 상태',
  i4: '취약 지출 항목',
  i5: '절감 가능 항목',
  i6: '노후 생활비 준비',
  s1: '투자 경험',
  s2: '변동성 허용',
  s3: '투자 기간',
  s4: '월 투자 여력',
  s5: '관심 투자 테마',
  s6: '손실 감내 수준',
  l1: '핵심 목표',
  l2: '목표 시점',
  l3: '절감 가능 지출',
  l4: '포기 불가 가치',
  l5: '달성 후 계획',
  l6: '방해 습관',
};

const insightByAnswer = (id: string, value: string): { interpretation: string; impact: string } => {
  if (id === 'c3') {
    if (value === '안정') return { interpretation: '안정 지향 성향이 강합니다.', impact: '수익률은 보수적으로, 목표 시점은 여유 있게 설정됩니다.' };
    if (value === '성장') return { interpretation: '성장 지향 성향이 강합니다.', impact: '기대 수익률이 소폭 상향 반영됩니다.' };
    if (value === '자유') return { interpretation: '빠른 시점의 자유를 중요하게 보십니다.', impact: '목표 은퇴 나이가 앞당겨져 계산됩니다.' };
    if (value === '건강') return { interpretation: '삶의 질과 건강 비용을 우선으로 두셨습니다.', impact: '목표 생활비가 상향 반영됩니다.' };
  }

  if (id === 'r1') {
    if (value === '매매') return { interpretation: '매매 전환 의지가 명확합니다.', impact: '월 지출/생활비 가정치가 높아져 목표 자산이 증가합니다.' };
    if (value === '전세') return { interpretation: '유동성 유지 전략을 선택하셨습니다.', impact: '종잣돈 축적 속도 중심으로 경로가 계산됩니다.' };
  }

  if (id === 'i1') {
    if (value === '없음') return { interpretation: '비상 대응 여력이 부족한 상태입니다.', impact: '방어 자산 우선 시나리오로 계산됩니다.' };
    if (value === '6개월 이상') return { interpretation: '기초 방어력은 양호한 편입니다.', impact: '안정 구간 진입 확률이 높게 반영됩니다.' };
  }

  if (id === 's2') {
    if (value === '매우 낮음' || value === '낮음') return { interpretation: '변동성 민감도가 높습니다.', impact: '예상 수익률이 보수적으로 적용됩니다.' };
    if (value === '높음') return { interpretation: '리스크 감내 수준이 높은 편입니다.', impact: '예상 수익률 상향 시나리오가 적용됩니다.' };
  }

  if (id === 'l2') {
    return { interpretation: '목표 시점 의지가 분명합니다.', impact: '은퇴 목표 나이/시간축에 직접 반영됩니다.' };
  }

  return { interpretation: '해당 선택이 계획에 반영되었습니다.', impact: '가이드 시뮬레이션에서 연관 지표를 조정합니다.' };
};

export const getDetailedAnswerInsights = (answers: Record<string, unknown>, limit = 6): AnswerInsight[] => {
  return Object.entries(answers)
    .filter(([key, value]) => key !== 'c0' && value !== '' && value !== null && value !== undefined)
    .slice(0, limit)
    .map(([id, rawValue]) => {
      const value = Array.isArray(rawValue) ? rawValue.join(', ') : String(rawValue);
      const details = insightByAnswer(id, value);
      return {
        id,
        label: QUESTION_LABELS[id] ?? id,
        value,
        interpretation: details.interpretation,
        impact: details.impact,
      };
    });
};
