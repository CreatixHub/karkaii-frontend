import SettingsPanelCard, {
  type SettingsPanelCardProps,
} from '../../../shared/SettingsPanelCard';

export type SystemCardProps = Omit<SettingsPanelCardProps, 'prefix'>;

const SystemCard = (props: SystemCardProps) => <SettingsPanelCard {...props} prefix="sys" />;

export default SystemCard;
