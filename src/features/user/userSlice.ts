import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAddress } from '../../services/apiGeocoding';
import { UserState } from '../../types';

function getPosition(): Promise<GeolocationPosition> {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export const fetchAddress = createAsyncThunk(
  'user/fetchAddress',
  async function () {
    // 1) We get the user's geolocation position
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Then we return an object with the data that we are interested in.
    // Payload of the FULFILLED state
    return { position, address };
  },
);

const initialState: UserState = {
  id: '',
  email: '',
  username: '',
  role: 'customer',
  isAuthenticated: false,
  isAuthLoading: true,
  status: 'idle',
  position: {},
  address: '',
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ id: string; email: string; username: string; role?: 'customer' | 'admin' }>) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.role = action.payload.role || 'customer';
      state.isAuthenticated = true;
      state.isAuthLoading = false;
    },
    logout(state) {
      state.id = '';
      state.email = '';
      state.username = '';
      state.role = 'customer';
      state.isAuthenticated = false;
      state.isAuthLoading = false;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isAuthLoading = action.payload;
    },
    updateAddress(state, action: PayloadAction<string>) {
      state.address = action.payload;
    },
    updateUserName(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = 'idle';
      })
      .addCase(fetchAddress.rejected, (state) => {
        state.status = 'error';
        state.error =
          'There was a problem getting your address. Make sure to fill this field!';
      }),
});

export const { setUser, logout, setAuthLoading, updateAddress, updateUserName } = userSlice.actions;

export default userSlice.reducer;
