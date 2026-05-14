import {create} from "zustand"
export const UseStore = create((set) => ({
    fullweatherdata: {},
    changefullweather: (newarr) => set({fullweatherdata: newarr}),
    bool: false,
    changebool: (newarr) => set({bool: newarr}),
}));