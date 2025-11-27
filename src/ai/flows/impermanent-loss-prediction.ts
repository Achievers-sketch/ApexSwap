'use server';
/**
 * @fileOverview Predicts impermanent loss for liquidity providers.
 *
 * - impermanentLossPrediction - A function that estimates potential impermanent loss.
 * - ImpermanentLossPredictionInput - The input type for the impermanentLossPrediction function.
 * - ImpermanentLossPredictionOutput - The return type for the impermanentLossPrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ImpermanentLossPredictionFormSchema = z.object({
  token0Amount: z.coerce.number().positive(),
  token1Amount: z.coerce.number().positive(),
  initialPriceRatio: z.coerce.number().positive(),
  currentPriceRatio: z.coerce.number().positive(),
  historicalVolatility: z.coerce.number().min(0).max(1),
});

const ImpermanentLossPredictionInputSchema = z.object({
  token0Amount: z.number().describe('Amount of token 0 provided.'),
  token1Amount: z.number().describe('Amount of token 1 provided.'),
  initialPriceRatio: z.number().describe('Initial price ratio between token 0 and token 1.'),
  currentPriceRatio: z.number().describe('Current price ratio between token 0 and token 1.'),
  historicalVolatility: z.number().describe('Historical volatility of the token pair (e.g., 0.1 for 10%).'),
});
export type ImpermanentLossPredictionInput = z.infer<
  typeof ImpermanentLossPredictionInputSchema
>;

const ImpermanentLossPredictionOutputSchema = z.object({
  impermanentLoss:
    z.number()
      .describe('Estimated impermanent loss in USD.'),
  explanation:
    z.string()
      .describe('Explanation of the impermanent loss calculation and potential risks.'),
});
export type ImpermanentLossPredictionOutput = z.infer<
  typeof ImpermanentLossPredictionOutputSchema
>;

export async function impermanentLossPrediction(
  input: ImpermanentLossPredictionInput
): Promise<ImpermanentLossPredictionOutput> {
  return impermanentLossPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'impermanentLossPredictionPrompt',
  input: {schema: ImpermanentLossPredictionInputSchema},
  output: {schema: ImpermanentLossPredictionOutputSchema},
  prompt: `You are an expert in decentralized finance (DeFi) and liquidity pool dynamics.  A liquidity provider has deposited the following amounts into a liquidity pool:

Token 0 Amount: {{{token0Amount}}}
Token 1 Amount: {{{token1Amount}}}
Initial Price Ratio (Token 0 / Token 1): {{{initialPriceRatio}}}
Current Price Ratio (Token 0 / Token 1): {{{currentPriceRatio}}}
Historical Volatility of Pair: {{{historicalVolatility}}}

Based on this information, calculate the estimated impermanent loss in USD and provide an explanation of the calculation and potential risks. Consider the impact of historical volatility on the impermanent loss.  Provide a concise explanation of how impermanent loss occurs.

Format your response as a JSON object conforming to the following schema:
${JSON.stringify(ImpermanentLossPredictionOutputSchema.description)}
`,
});

const impermanentLossPredictionFlow = ai.defineFlow(
  {
    name: 'impermanentLossPredictionFlow',
    inputSchema: ImpermanentLossPredictionInputSchema,
    outputSchema: ImpermanentLossPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
