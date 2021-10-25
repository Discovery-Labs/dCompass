import Box from "3box";

export const legacy3BoxToCeramic = async (address: string, provider: any) => {
  const box = await Box.create(provider);
  const authBox = await Box.openBox(address, (window as any).ethereum);
  const gtc = await authBox.openSpace("GitCoin");
  await box.syncDone;
  const [publicData, privateData, legacyProfile] = await Promise.all([
    await gtc.public.all(),
    await gtc.private.all(),
    await authBox.public.all(),
  ]);
  console.log({ legacyProfile });
  return { publicData, privateData, legacyProfile } as Record<string, any>;
};
