export interface DefaultSettings {
  theme: 'light' | 'dark';
  primaryColor: string;
  title: string;
  pwa: boolean;
  iconfontUrl: string;
}
const settings: DefaultSettings = {
  theme: 'light',
  primaryColor: '#1890ff',
  title: '听鱼吐泡泡',
  pwa: false,
  iconfontUrl: '',
};

export default settings;
