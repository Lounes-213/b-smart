import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useProfiles } from "@/app-shell";
import {
  DEFAULT_CONNECT_APEX_URL,
  describeEnrollmentError,
  redeemEnrollment,
  type ConnectPairingInput,
  type EnrollmentFailure,
} from "@/data/connect";
import { describeThisDevice } from "@/lib/device-label";
import { Button, Icon, Spinner, Text, toast } from "@/ui";
import { ConnectScanner } from "./ConnectScanner";

type Phase =
  | { kind: "scanning" }
  | { kind: "connecting" }
  | { kind: "failed"; failure: EnrollmentFailure };

export function ConnectEnrollScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ profileId?: string }>();
  const { profiles, addProfile, updateProfile, setActiveProfile } = useProfiles();
  const [phase, setPhase] = useState<Phase>({ kind: "scanning" });

  const reauthProfile =
    params.profileId !== undefined
      ? (profiles.find(
          (profile) =>
            profile.id === params.profileId && profile.mode === "connect",
        ) ?? null)
      : null;
  const reauth = reauthProfile?.mode === "connect" ? reauthProfile : null;

  const busy = phase.kind === "connecting";

  const onScanned = async (input: ConnectPairingInput) => {
    setPhase({ kind: "connecting" });
    try {
      const targetApex = input.apexUrl || DEFAULT_CONNECT_APEX_URL;
      const targetServer = input.serverUrl || targetApex;
      let profileId: string;

      try {
        const redeemed = await redeemEnrollment({
          apexUrl: targetApex,
          code: input.code,
          deviceName: describeThisDevice(),
          label: reauth?.label,
        });

        if (reauth) {
          const updated = await updateProfile(reauth.id, {
            serverUrl: redeemed.profile.serverUrl,
            handle: redeemed.profile.handle,
            credential: redeemed.profile.credential,
          });
          profileId = updated.id;
        } else {
          const added = await addProfile(redeemed.profile);
          profileId = added.id;
        }
      } catch {
        if (reauth) {
          const updated = await updateProfile(reauth.id, {
            serverUrl: targetServer,
          });
          profileId = updated.id;
        } else {
          const added = await addProfile({
            mode: "direct",
            serverUrl: targetServer,
            label: "b smart",
          });
          profileId = added.id;
        }
      }

      await setActiveProfile(profileId);
      toast.success("Connected to b smart!");
      router.replace("/webview");
    } catch (error) {
      setPhase({ kind: "failed", failure: describeEnrollmentError(error) });
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Scan QR Code",
          headerShown: false,
        }}
      />
      <View
        className="flex-1 bg-background px-6 pt-14 pb-8 items-center justify-between"
        testID="connect-screen"
      >
        <View className="items-center w-full">
          <View className="size-16 rounded-2xl bg-surface-grouped-cell border border-border items-center justify-center mb-3 shadow-sm">
            <Icon name="Smartphone" size={32} />
          </View>
          <Text variant="titleLarge" className="font-bold text-center">
            Scan to Connect
          </Text>
          <Text variant="bodySmall" tone="muted" className="text-center mt-1.5 px-4">
            Point camera at the QR code on your desktop screen to enter the app.
          </Text>
        </View>

        <View className="w-full max-w-sm my-4">
          {busy ? (
            <View className="h-80 items-center justify-center bg-surface-grouped-cell rounded-3xl border border-border gap-3 shadow-md">
              <Spinner size="large" />
              <Text variant="bodyMedium" className="font-semibold">
                Connecting to b smart…
              </Text>
            </View>
          ) : (
            <ConnectScanner active={phase.kind === "scanning"} onScanned={onScanned} />
          )}

          {phase.kind === "failed" && (
            <View className="mt-4 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 items-center gap-2">
              <Text variant="footnote" tone="destructive" className="text-center font-medium">
                {phase.failure.message}
              </Text>
              <Button
                variant="outline"
                size="sm"
                onPress={() => setPhase({ kind: "scanning" })}
              >
                Scan again
              </Button>
            </View>
          )}
        </View>

        <View className="items-center">
          <Text variant="caption1" tone="muted">
            bs Companion · Instant Scan & Connect
          </Text>
        </View>
      </View>
    </>
  );
}
