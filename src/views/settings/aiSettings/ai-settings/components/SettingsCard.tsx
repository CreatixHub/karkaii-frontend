import SettingsPanelCard, {
  type SettingsPanelCardProps,
} from '../../../shared/SettingsPanelCard';

export type SettingsCardProps = Omit<SettingsPanelCardProps, 'prefix'>;

const SettingsCard = (props: SettingsCardProps) => (
  <SettingsPanelCard {...props} prefix="aig" />
);

export default SettingsCard;
