import { Model, MODEL_DESCRIPTIONS } from './models';

describe('Model Enum', () => {
  it('should have correct enum values', () => {
    expect(Model.MISTRAL_7B_INSTRUCT_V0_2_Q4F16_1).toBe("Mistral-7B-Instruct-v0.2-q4f16_1");
    expect(Model.LLAMA_3_8B_INSTRUCT_Q4F16_1).toBe("Llama-3-8B-Instruct-q4f16_1");
    expect(Model.TINYLAMA_1_1B_CHAT_V0_4_Q4F32_1_1K).toBe("TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k");
    expect(Model.PHI1_5_Q4F16_1_1K).toBe("Phi1.5-q4f16_1-1k");
  });
});

describe('MODEL_DESCRIPTIONS', () => {
  it('should have descriptions for all models', () => {
    expect(MODEL_DESCRIPTIONS[Model.LLAMA_3_8B_INSTRUCT_Q4F16_1]).toBeDefined();
    expect(MODEL_DESCRIPTIONS[Model.MISTRAL_7B_INSTRUCT_V0_2_Q4F16_1]).toBeDefined();
    expect(MODEL_DESCRIPTIONS[Model.TINYLAMA_1_1B_CHAT_V0_4_Q4F32_1_1K]).toBeDefined();
    expect(MODEL_DESCRIPTIONS[Model.PHI1_5_Q4F16_1_1K]).toBeDefined();
  });

  it('should have correct display names', () => {
    expect(MODEL_DESCRIPTIONS[Model.LLAMA_3_8B_INSTRUCT_Q4F16_1].displayName).toBe("Llama 3");
    expect(MODEL_DESCRIPTIONS[Model.MISTRAL_7B_INSTRUCT_V0_2_Q4F16_1].displayName).toBe("Mistral 7B");
    expect(MODEL_DESCRIPTIONS[Model.TINYLAMA_1_1B_CHAT_V0_4_Q4F32_1_1K].displayName).toBe("TinyLlama");
    expect(MODEL_DESCRIPTIONS[Model.PHI1_5_Q4F16_1_1K].displayName).toBe("Phi 1.5");
  });

  it('should have correct icons', () => {
    expect(MODEL_DESCRIPTIONS[Model.LLAMA_3_8B_INSTRUCT_Q4F16_1].icon).toBe("🦙");
    expect(MODEL_DESCRIPTIONS[Model.MISTRAL_7B_INSTRUCT_V0_2_Q4F16_1].icon).toBe("🌬️");
    expect(MODEL_DESCRIPTIONS[Model.TINYLAMA_1_1B_CHAT_V0_4_Q4F32_1_1K].icon).toBe("🦙");
    expect(MODEL_DESCRIPTIONS[Model.PHI1_5_Q4F16_1_1K].icon).toBe("🦙");
  });

  it('should have the expected structure', () => {
    Object.values(MODEL_DESCRIPTIONS).forEach(description => {
      expect(description).toHaveProperty('displayName');
      expect(description).toHaveProperty('icon');
      expect(typeof description.displayName).toBe('string');
      expect(typeof description.icon).toBe('string');
    });
  });
});