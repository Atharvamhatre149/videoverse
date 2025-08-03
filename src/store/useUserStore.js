import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isHydrated: false,
      setUser: (userData) => {
        if (!userData) return set({ user: null });
        set({ 
          user: {
            _id: userData._id,
            username: userData.username,
            fullname: userData.fullname,
            avatar: userData.avatar,
            email: userData.email
          },
          isHydrated: true 
        });
      },
      clearUser: () => set({ user: null }),
      getUser: () => get().user,
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state.isHydrated = true;
      },
      partialize: (state) => ({
        user: state.user
      })
    }
  )
);

export default useUserStore; 