# Secret Llama

![secret llama](https://github.com/abi/secret-llama/assets/23818/0bf43a95-4fe5-4c53-87bc-b558e5c4968f)

Fully private LLM chatbot supporting various open weights models (Llama 3, Mistral, etc.). This project focuses on providing an easy-to-use interface on par with ChatGPT, but for open source LLMs. Big thanks to the inference engine provided by [webllm](https://github.com/mlc-ai/web-llm).

- Fully private = No conversation data ever leaves your computer
- Runs in the browser - no server needed and no install needed!
- Works offline

## System Requirements

To run this, you need a modern browser with support for WebGPU, as this is the technology used for running the machine learning models in the browser. According to [caniuse](https://caniuse.com/?search=WebGPU), as of the time of writing, WebGPU is supported:

- Google Chrome
- Microsoft Edge

It's also available in Firefox, but it needs to be enabled manually through the dom.webgpu.enabled flag. Safari on MacOS also has experimental support for WebGPU which can be enabled through the WebGPU experimental feature. In addition to WebGPU support, various models might have specific RAM requirements.

## Try it out

You can [try it here](https://secretllama.com).

To compile the React code yourself, download the repo and then, run

```
yarn
yarn build-and-preview
```

If you're looking to make changes, run the development environment with live reload:

```
yarn
yarn dev
```

## Supported models

| Model                     | Model Size |
|---------------------------|------------|
| TinyLlama-1.1B-Chat-v0.4-q4f32_1-1k | 600MB      |
| Llama-3-8B-Instruct-q4f16_1 ⭐         | 4.3GB      |
| Phi1.5-q4f16_1-1k                   | 1.2GB        |
| Mistral-7B-Instruct-v0.2-q4f16_1 ⭐    | 4GB        |


## Looking for contributors

We would love contributions to improve the interface, support more models, speed up initial model loading time and fix bugs.

## Other Projects

Check out [screenshot to code](https://github.com/abi/screenshot-to-code) and [Pico - AI-powered app builder](https://picoapps.xyz)
