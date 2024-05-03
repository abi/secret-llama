export enum Model {
  MISTRAL_7B_INSTRUCT_V0_2_Q4F16_1 = "Mistral-7B-Instruct-v0.2-q4f16_1",
  LLAMA_3_8B_INSTRUCT_Q4F16_1 = "Llama-3-8B-Instruct-q4f16_1",
  TINYLAMA_1_1B_CHAT_V0_4_Q4F32_1_1K = "TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k",
  PHI1_5_Q4F16_1_1K = "Phi1.5-q4f16_1-1k",
}

export const MODEL_DESCRIPTIONS: {
  [key in Model]: { displayName: string; icon: string };
} = {
  "Llama-3-8B-Instruct-q4f16_1": {
    displayName: "Llama 3",
    icon: "🦙",
  },
  "Mistral-7B-Instruct-v0.2-q4f16_1": {
    displayName: "Mistral 7B",
    icon: "🌬️",
  },
  "TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k": {
    displayName: "TinyLlama",
    icon: "🦙",
  },
  "Phi1.5-q4f16_1-1k": {
    displayName: "Phi 1.5",
    icon: "🦙",
  },
};
