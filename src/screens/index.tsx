import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Linking,
  Share,
  Alert,
  TextInput as RNTextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  AlertTriangle,
  Share2,
  MapPin,
  Calendar,
  Search as SearchIcon,
  PlusCircle,
  Camera,
  X,
} from 'lucide-react-native';

import { Text } from '../components/Text';
import { PostCard } from '../components/PostCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { colors, typography } from '../theme';
import { usePosts } from '../hooks/usePosts';
import { usePost } from '../hooks/usePost';
import { supabase } from '../utils/supabase';
import { PostType, CATEGORIES, LOCATIONS } from '../types/post';
import { RootStackParamList } from '../types/navigation';

// --- Home Screen ---
export const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState<PostType>('lost');
  const { posts, loading, refresh } = usePosts(activeTab);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderHeader = () => (
    <View style={styles.header}>
      <Text variant="displaySmall" style={styles.title}>አገኘሁ</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'lost' && styles.activeTab]}
          onPress={() => setActiveTab('lost')}
        >
          <Text
            variant="labelLarge"
            color={activeTab === 'lost' ? 'secondary' : 'onSurfaceVariant'}
          >
            Lost
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'found' && styles.activeTab]}
          onPress={() => setActiveTab('found')}
        >
          <Text
            variant="labelLarge"
            color={activeTab === 'found' ? 'tertiary' : 'onSurfaceVariant'}
          >
            Found
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        onRefresh={refresh}
        refreshing={loading && posts.length > 0}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
          ) : (
            <View style={styles.empty}>
              <Text variant="bodyLarge" color="onSurfaceVariant">No items found</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

// --- Post Details Screen ---
export const PostDetailsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'PostDetails'>>();
  const navigation = useNavigation();
  const { post, loading } = usePost(route.params.postId);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text variant="bodyLarge">Post not found</Text>
        <Button title="Go Back" onPress={() => (navigation as any).goBack()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  const isLost = post.type === 'lost';
  const statusColor = isLost ? colors.secondary : colors.tertiary;

  const handleCall = () => {
    if (post.contact_phone) {
      Linking.openURL(`tel:${post.contact_phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (post.whatsapp_phone) {
      const message = `Helllo, I am contacting you regarding your post "${post.title}" on Agenehu.`;
      Linking.openURL(`whatsapp://send?phone=${post.whatsapp_phone}&text=${encodeURIComponent(message)}`);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${post.type} item on Agenehu: ${post.title}\nLocation: ${post.location}\nDate: ${post.event_date}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleReport = () => {
    Alert.alert(
      'Report Post',
      'Are you sure you want to report this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.from('reports').insert({
              post_id: post.id,
              reason: 'User reported from app',
            });
            if (!error) {
              Alert.alert('Thank you', 'The post has been reported and will be reviewed.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.detailsContent}>
        <View style={styles.detailsHeader}>
          <TouchableOpacity onPress={() => (navigation as any).goBack()} style={styles.backButton}>
            <ArrowLeft color={colors.onSurface} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.backButton}>
            <Share2 color={colors.onSurface} size={24} />
          </TouchableOpacity>
        </View>

        {post.image_url ? (
          <Image source={{ uri: post.image_url }} style={styles.detailsImage} />
        ) : (
          <View style={[styles.detailsImagePlaceholder, { backgroundColor: statusColor + '10' }]}>
            <Text variant="labelLarge" color={statusColor}>No Image Provided</Text>
          </View>
        )}

        <View style={styles.detailsBody}>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
              <Text variant="labelMedium" color={statusColor}>{post.type.toUpperCase()}</Text>
            </View>
            <Text variant="labelMedium" color="onSurfaceVariant">{post.category}</Text>
          </View>

          <Text variant="headlineLarge" style={styles.detailsTitle}>{post.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MapPin size={16} color={colors.outline} />
              <Text variant="bodyMedium" color="onSurfaceVariant" style={styles.metaText}>{post.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Calendar size={16} color={colors.outline} />
              <Text variant="bodyMedium" color="onSurfaceVariant" style={styles.metaText}>
                {format(new Date(post.event_date), 'MMMM d, yyyy')}
              </Text>
            </View>
          </View>

          <Text variant="bodyLarge" style={styles.detailsDescription}>{post.description}</Text>

          <View style={styles.actionRow}>
            {post.contact_phone && (
              <Button
                title="Call"
                onPress={handleCall}
                style={styles.actionButton}
                variant="primary"
              />
            )}
            {post.whatsapp_phone && (
              <Button
                title="WhatsApp"
                onPress={handleWhatsApp}
                style={styles.actionButton}
                variant="secondary"
              />
            )}
          </View>

          <TouchableOpacity onPress={handleReport} style={styles.reportButton}>
            <AlertTriangle size={16} color={colors.outline} />
            <Text variant="labelMedium" color="outline" style={styles.reportText}>Report Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// --- Search Screen ---
export const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const { posts, loading, refresh } = usePosts(undefined, { query, location, category });
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderHeader = () => (
    <View style={styles.header}>
      <Text variant="displaySmall" style={styles.title}>Search</Text>
      
      <View style={styles.searchBar}>
        <SearchIcon size={20} color={colors.outline} />
        <RNTextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={query}
          onChangeText={setQuery}
          placeholderTextColor={colors.outline}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <TouchableOpacity 
          style={[styles.filterChip, !location && styles.activeFilterChip]}
          onPress={() => setLocation(undefined)}
        >
          <Text variant="labelMedium" color={!location ? 'primary' : 'onSurface'}>All Areas</Text>
        </TouchableOpacity>
        {LOCATIONS.map(loc => (
          <TouchableOpacity 
            key={loc} 
            style={[styles.filterChip, location === loc && styles.activeFilterChip]}
            onPress={() => setLocation(loc)}
          >
            <Text variant="labelMedium" color={location === loc ? 'primary' : 'onSurface'}>{loc}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <TouchableOpacity 
          style={[styles.filterChip, !category && styles.activeFilterChip]}
          onPress={() => setCategory(undefined)}
        >
          <Text variant="labelMedium" color={!category ? 'primary' : 'onSurface'}>All Categories</Text>
        </TouchableOpacity>
        {CATEGORIES.map(cat => (
          <TouchableOpacity 
            key={cat} 
            style={[styles.filterChip, category === cat && styles.activeFilterChip]}
            onPress={() => setCategory(cat)}
          >
            <Text variant="labelMedium" color={category === cat ? 'primary' : 'onSurface'}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        onRefresh={refresh}
        refreshing={loading && posts.length > 0}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
          ) : (
            <View style={styles.empty}>
              <Text variant="bodyLarge" color="onSurfaceVariant">No items match your search</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

// --- Create Post Screen ---
import * as ImagePicker from 'expo-image-picker';
import { useStorage } from '../hooks/useStorage';

export const CreatePostScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { uploadImage, uploading: imageUploading } = useStorage();
  
  const [type, setType] = useState<PostType>('lost');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !phone) {
      Alert.alert('Error', 'Please fill in all required fields (Title, Description, Phone).');
      return;
    }

    try {
      setSubmitting(true);
      
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
        if (!imageUrl) {
          Alert.alert('Error', 'Failed to upload image. Please try again.');
          return;
        }
      }

      const { error } = await supabase.from('posts').insert({
        type,
        title,
        description,
        category,
        location,
        event_date: new Date().toISOString().split('T')[0], // Use today's date for MVP
        image_url: imageUrl,
        contact_phone: phone,
        whatsapp_phone: whatsapp || phone,
        status: 'active',
      });

      if (error) throw error;

      Alert.alert('Success', 'Post created successfully!', [
        { text: 'OK', onPress: () => {
          resetForm();
          navigation.navigate('MainTabs');
        }}
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory(CATEGORIES[0]);
    setLocation(LOCATIONS[0]);
    setPhone('');
    setWhatsapp('');
    setImage(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text variant="headlineLarge" style={styles.formTitle}>Post an Item</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, type === 'lost' && styles.activeTab]}
            onPress={() => setType('lost')}
          >
            <Text variant="labelLarge" color={type === 'lost' ? 'secondary' : 'onSurfaceVariant'}>Lost</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, type === 'found' && styles.activeTab]}
            onPress={() => setType('found')}
          >
            <Text variant="labelLarge" color={type === 'found' ? 'tertiary' : 'onSurfaceVariant'}>Found</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={pickImage} style={styles.imageSelector}>
          {image ? (
            <View>
              <Image source={{ uri: image }} style={styles.selectedImage} />
              <TouchableOpacity onPress={() => setImage(null)} style={styles.removeImage}>
                <X color="white" size={20} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Camera size={40} color={colors.outline} />
              <Text variant="bodyMedium" color="outline" style={{ marginTop: 8 }}>Add a photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <Input
          label="Title"
          placeholder="e.g. Lost iPhone 13"
          value={title}
          onChangeText={setTitle}
        />
        
        <Input
          label="Description"
          placeholder="Describe the item, where you lost/found it..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{ height: 120, textAlignVertical: 'top', paddingTop: 12 }}
        />

        <View style={styles.row}>
           <View style={{ flex: 1, marginRight: 8 }}>
              <Text variant="labelMedium" color="onSurfaceVariant" style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                 {/* Dummy picker for now, ideally use a modal or actual picker */}
                 <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {CATEGORIES.map(cat => (
                      <TouchableOpacity 
                        key={cat} 
                        onPress={() => setCategory(cat)}
                        style={[styles.pickerItem, category === cat && styles.activePickerItem]}
                      >
                        <Text variant="bodySmall" color={category === cat ? 'primary' : 'onSurface'}>{cat}</Text>
                      </TouchableOpacity>
                    ))}
                 </ScrollView>
              </View>
           </View>
        </View>

        <View style={{ marginTop: 16 }}>
           <Text variant="labelMedium" color="onSurfaceVariant" style={styles.label}>Location</Text>
           <View style={styles.pickerContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                 {LOCATIONS.map(loc => (
                    <TouchableOpacity 
                      key={loc} 
                      onPress={() => setLocation(loc)}
                      style={[styles.pickerItem, location === loc && styles.activePickerItem]}
                    >
                      <Text variant="bodySmall" color={location === loc ? 'primary' : 'onSurface'}>{loc}</Text>
                    </TouchableOpacity>
                 ))}
              </ScrollView>
           </View>
        </View>

        <Input
          label="Phone Number"
          placeholder="0911..."
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          containerStyle={{ marginTop: 16 }}
        />

        <Input
          label="WhatsApp Number (Optional)"
          placeholder="0911..."
          keyboardType="phone-pad"
          value={whatsapp}
          onChangeText={setWhatsapp}
        />

        <Button
          title={submitting || imageUploading ? "Posting..." : "Create Post"}
          onPress={handleSubmit}
          loading={submitting || imageUploading}
          style={styles.submitButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: colors.surfaceContainerLowest,
  },
  listContent: {
    paddingBottom: 24,
  },
  loading: {
    marginTop: 40,
  },
  empty: {
    marginTop: 40,
    alignItems: 'center',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  detailsContent: {
    paddingBottom: 40,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsImage: {
    width: '100%',
    height: 300,
  },
  detailsImagePlaceholder: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsBody: {
    padding: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  detailsTitle: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 8,
  },
  detailsDescription: {
    lineHeight: 26,
    marginBottom: 32,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  reportText: {
    marginLeft: 8,
  },
  formContainer: {
    padding: 24,
    paddingBottom: 60,
  },
  formTitle: {
    marginBottom: 24,
  },
  imageSelector: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  removeImage: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    marginBottom: 8,
    marginLeft: 4,
  },
  pickerContainer: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 8,
  },
  pickerItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: colors.surfaceContainerLowest,
  },
  activePickerItem: {
    backgroundColor: colors.primaryContainer,
  },
  submitButton: {
    marginTop: 32,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    ...typography.bodyLarge,
    color: colors.onSurface,
  },
  filterScroll: {
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLow,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: colors.primaryContainer,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
