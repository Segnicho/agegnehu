import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Post } from '../types/post';
import { Card } from './Card';
import { Text } from './Text';
import { colors } from '../theme';
import { MapPin, Calendar } from 'lucide-react-native';
import { format } from 'date-fns';

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPress }) => {
  const isLost = post.type === 'lost';
  const statusColor = isLost ? colors.secondary : colors.tertiary;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Card style={styles.container} variant="lowest">
        {post.image_url ? (
          <Image source={{ uri: post.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: statusColor + '20' }]}>
             <Text variant="labelLarge" color={statusColor}>No Image</Text>
          </View>
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="headlineSmall" numberOfLines={1} style={styles.title}>
              {post.title}
            </Text>
            <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
              <Text variant="labelMedium" color={statusColor} style={styles.badgeText}>
                {post.type.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text variant="bodyMedium" numberOfLines={2} color="onSurfaceVariant" style={styles.description}>
            {post.description}
          </Text>

          <View style={styles.footer}>
            <View style={styles.footerItem}>
              <MapPin size={14} color={colors.outline} />
              <Text variant="labelMedium" color="outline" style={styles.footerText}>
                {post.location}
              </Text>
            </View>
            <View style={styles.footerItem}>
              <Calendar size={14} color={colors.outline} />
              <Text variant="labelMedium" color="outline" style={styles.footerText}>
                {format(new Date(post.event_date), 'MMM d, yyyy')}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    overflow: 'hidden',
    padding: 0,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: colors.surfaceContainerLow,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    textTransform: 'capitalize',
  },
  description: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  footerText: {
    marginLeft: 4,
  },
});
