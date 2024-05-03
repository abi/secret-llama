# fully-private-chat

Fully private, browser-based UI for open weights models (Llama 3, Mistral, etc.). The focus for this project is on bringing an easy-to-use interface on par with ChatGPT or any other hosted LLM to open source LLMs.
 
## System Requirements

The system requirements for running this application include a modern browser with support for WebGPU, as this is the technology used for running the machine learning models in the browser. According to [caniuse](https://caniuse.com/?search=WebGPU), as of the time of writing, WebGPU is supported in the latest versions of Google Chrome and Microsoft Edge. It's also available in Firefox, but it needs to be enabled manually through the dom.webgpu.enabled flag. Safari on MacOS also has experimental support for WebGPU which can be enabled through the WebGPU experimental feature. It's important to note that WebGPU is a powerful feature and may have high system requirements, including a capable GPU and sufficient system memory.

## Try it out

You can [try it here](https://fullyprivatechat.com/).

To compile the React code yourself, download the repo and then, run

```
yarn
yarn build-and-preview
```

If you're looking to make changes, to run the development environment,

```
yarn
yarn dev
```

## Looking for contributors

Would love contributions to improve the interface, support more models or speed up initial model loading time.
