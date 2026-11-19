import ServerBuilderApp from '@/components/tools/ServerBuilderApp';
import { getServerModels } from '@/lib/serverBuilder';

// Server builder tool: reads the published servers on the server (at most once an hour) and hands them to the
// builder in the browser.
export default async function ServerBuilder() {
  const models = await getServerModels();
  return <ServerBuilderApp models={models} />;
}
