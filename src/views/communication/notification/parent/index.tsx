import MessageComposer from '@/views/communication/compose/MessageComposer';
import { channels } from '@/views/communication/compose/channels.data';

const ParentCommunicationPage = () => <MessageComposer config={channels['parent']} />;

export default ParentCommunicationPage;
