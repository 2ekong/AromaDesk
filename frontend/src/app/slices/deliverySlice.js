import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deliveryApi } from "../../api/deliveryApi";

// 비동기 액션들
export const fetchDeliveries = createAsyncThunk(
  "delivery/fetchDeliveries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await deliveryApi.getDeliveries();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDeliveryById = createAsyncThunk(
  "delivery/fetchDeliveryById",
  async (deliveryId, { rejectWithValue }) => {
    try {
      const response = await deliveryApi.getDeliveryById(deliveryId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createDeliveryAction = createAsyncThunk(
  "delivery/createDelivery",
  async (deliveryData, { rejectWithValue }) => {
    try {
      const response = await deliveryApi.createDelivery(deliveryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDeliveryAction = createAsyncThunk(
  "delivery/updateDelivery",
  async ({ deliveryId, deliveryData }, { rejectWithValue }) => {
    try {
      const response = await deliveryApi.updateDelivery(
        deliveryId,
        deliveryData
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDeliveryStatusAction = createAsyncThunk(
  "delivery/updateStatus",
  async ({ deliveryId, status }, { rejectWithValue }) => {
    try {
      const response = await deliveryApi.updateDeliveryStatus(
        deliveryId,
        status
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDeliveryAction = createAsyncThunk(
  "delivery/deleteDelivery",
  async (deliveryId, { rejectWithValue }) => {
    try {
      await deliveryApi.deleteDelivery(deliveryId);
      return deliveryId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const deliverySlice = createSlice({
  name: "delivery",
  initialState: {
    deliveries: [],
    currentDelivery: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentDelivery: (state) => {
      state.currentDelivery = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDeliveries
      .addCase(fetchDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveries = action.payload;
      })
      .addCase(fetchDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchDeliveryById
      .addCase(fetchDeliveryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDelivery = action.payload;
      })
      .addCase(fetchDeliveryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createDeliveryAction
      .addCase(createDeliveryAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeliveryAction.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveries.push(action.payload);
      })
      .addCase(createDeliveryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateDeliveryAction
      .addCase(updateDeliveryAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeliveryAction.fulfilled, (state, action) => {
        state.loading = false;
        // 배송 목록에서 해당 배송 업데이트
        const index = state.deliveries.findIndex(
          (d) => d.id === action.payload.id
        );
        if (index !== -1) {
          state.deliveries[index] = action.payload;
        }
        // 현재 배송이 업데이트된 배송이라면 함께 업데이트
        if (
          state.currentDelivery &&
          state.currentDelivery.id === action.payload.id
        ) {
          state.currentDelivery = action.payload;
        }
      })
      .addCase(updateDeliveryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateDeliveryStatusAction
      .addCase(updateDeliveryStatusAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeliveryStatusAction.fulfilled, (state, action) => {
        state.loading = false;
        // 배송 목록에서 해당 배송 업데이트
        const index = state.deliveries.findIndex(
          (d) => d.id === action.payload.id
        );
        if (index !== -1) {
          state.deliveries[index] = action.payload;
        }
        // 현재 배송이 업데이트된 배송이라면 함께 업데이트
        if (
          state.currentDelivery &&
          state.currentDelivery.id === action.payload.id
        ) {
          state.currentDelivery = action.payload;
        }
      })
      .addCase(updateDeliveryStatusAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteDeliveryAction
      .addCase(deleteDeliveryAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeliveryAction.fulfilled, (state, action) => {
        state.loading = false;
        // 배송 목록에서 해당 배송 제거
        state.deliveries = state.deliveries.filter(
          (d) => d.id !== action.payload
        );
        // 현재 배송이 삭제된 배송이라면 null로 설정
        if (
          state.currentDelivery &&
          state.currentDelivery.id === action.payload
        ) {
          state.currentDelivery = null;
        }
      })
      .addCase(deleteDeliveryAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentDelivery } = deliverySlice.actions;
export default deliverySlice.reducer;
