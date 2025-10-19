import { commonStyles } from '@/constants/styles';
import { ScrollView } from 'react-native';

export default function CustomScrollView({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={commonStyles.content}>
      {children}
    </ScrollView>
  );
}
