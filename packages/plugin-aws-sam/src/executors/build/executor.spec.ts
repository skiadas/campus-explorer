import { BuildExecutorSchema } from './schema';
import executor from './executor';

const options: BuildExecutorSchema = {
  outputPath: "TODO",
  template: "TODO",
  config: "TODO"
};

describe.skip('Build Executor', () => {
  it('can run', async () => {
    const output = await executor(options, null);
    expect(output.success).toBe(true);
  });
});
