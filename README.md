# AVS Explorer

This is a sample repository built with the [Next.js](https://nextjs.org/) starter command ([create-next-app](https://nextjs.org/docs/app/api-reference/create-next-app)) to demonstrate how to use [Dune EigenLayer API](https://docs.dune.com/api-reference/eigenlayer/introduction). 


Check out the [`dune.ts`](https://github.com/agaperste/avs-explorer-demo/blob/main/src/pages/api/dune.ts) and [`eigenlayer.ts`](https://github.com/agaperste/avs-explorer-demo/blob/main/src/services/eigenlayer.ts) files to see how the Dune EigenLayer API is incorporated.

## Running Locally

Follow these steps to build and run the project locally:

1. Clone the repository:
    ```bash
    git clone https://github.com/agaperste/avs-explorer-demo.git
    cd avs-explorer
    ```

2. Fill in the secrets within the `.env` file. (_See `.env.sample` for the required environment variables._)

3. Install dependencies and run the development server:
    ```bash
    npm install
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Have Questions?

- Visit [Dune EigenLayer API doc](https://docs.dune.com/api-reference/eigenlayer/introduction).
- See [how to turn any Dune query into an API endpoint](https://youtu.be/o29ig849qMY).
- [Reach out to me](https://twitter.com/agaperste).
