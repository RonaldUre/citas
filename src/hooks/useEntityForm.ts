/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type UseFormReturn,
} from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export function useEntityForm<TFormValues extends FieldValues, TDetail = any>({
  defaultValues,
  resolver,
  listRoute,
  // data fns
  fetchById,
  createFn,
  updateFn,
  // opcionales
  mapDetailToForm,
  onLoaded,
  onLoadError,
  onCreateSuccess,
  onUpdateSuccess,
  onSubmitError,
}: {
  defaultValues: DefaultValues<TFormValues>;
  resolver: Resolver<TFormValues>;
  listRoute: string;

  fetchById?: (id: number) => Promise<TDetail>;
  createFn: (payload: TFormValues) => Promise<unknown>;
  updateFn: (id: number, payload: TFormValues) => Promise<unknown>;

  mapDetailToForm?: (detail: TDetail) => TFormValues;
  onLoaded?: (detail: TDetail) => void;
  onLoadError?: (error: unknown) => void;
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
  onSubmitError?: (error: unknown) => void;
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = useMemo(() => !!id, [id]);

  const [loading, setLoading] = useState(false);

  // refs para evitar depender de funciones (estables entre renders)
  const fetchRef = useRef(fetchById);
  const createRef = useRef(createFn);
  const updateRef = useRef(updateFn);
  const mapRef = useRef<(d: TDetail) => TFormValues>(
    mapDetailToForm ?? ((d) => d as unknown as TFormValues)
  );
  const onLoadedRef = useRef(onLoaded);
  const onLoadErrorRef = useRef(onLoadError);
  const onCreateSuccessRef = useRef(onCreateSuccess);
  const onUpdateSuccessRef = useRef(onUpdateSuccess);
  const onSubmitErrorRef = useRef(onSubmitError);

  useEffect(() => {
    fetchRef.current = fetchById;
  }, [fetchById]);
  useEffect(() => {
    createRef.current = createFn;
  }, [createFn]);
  useEffect(() => {
    updateRef.current = updateFn;
  }, [updateFn]);
  useEffect(() => {
    mapRef.current = mapDetailToForm ?? ((d) => d as unknown as TFormValues);
  }, [mapDetailToForm]);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);
  useEffect(() => {
    onLoadErrorRef.current = onLoadError;
  }, [onLoadError]);
  useEffect(() => {
    onCreateSuccessRef.current = onCreateSuccess;
  }, [onCreateSuccess]);
  useEffect(() => {
    onUpdateSuccessRef.current = onUpdateSuccess;
  }, [onUpdateSuccess]);
  useEffect(() => {
    onSubmitErrorRef.current = onSubmitError;
  }, [onSubmitError]);

  // RHF (usa los 3 genéricos para evitar warnings)
  const form: UseFormReturn<TFormValues, any, TFormValues> = useForm<
    TFormValues,
    any,
    TFormValues
  >({
    resolver,
    defaultValues,
    mode: "onSubmit",
    shouldUseNativeValidation: false,
  });

  // Guard para no recargar dos veces en StrictMode o por renders extra
  const loadedForIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isEditing) return;

    const numId = Number(id);
    if (!Number.isFinite(numId)) {
      toast.error("ID inválido");
      navigate(listRoute);
      return;
    }

    // si ya cargamos este id, no lo repitamos
    if (loadedForIdRef.current === numId) {
      setLoading(false); // <-- añade esto
      return;
    }

    if (!fetchRef.current) {
      toast.error("No se configuró la carga del registro");
      navigate(listRoute);
      return;
    }

    let canceled = false;
    setLoading(true);

    fetchRef
      .current(numId)
      ?.then((detail) => {
        if (canceled) return;
        form.reset(mapRef.current(detail as TDetail));
        onLoadedRef.current?.(detail as TDetail);
      })
      .catch((err) => {
        if (canceled) return;
        console.error(err);
        onLoadErrorRef.current?.(err);
        toast.error("No se pudo cargar el registro");
        navigate(listRoute);
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    return () => {
      canceled = true;
      setLoading(false); 
    };
    // deps SOLO por id/mode/ruta; nada de funciones acá
  }, [id, isEditing, navigate, listRoute, form]);

  const onSubmit = useCallback(
    async (values: TFormValues) => {
      try {
        if (isEditing) {
          await updateRef.current!(Number(id), values);
          onUpdateSuccessRef.current?.();
          toast.success("Registro actualizado");
        } else {
          await createRef.current!(values);
          onCreateSuccessRef.current?.();
          toast.success("Registro creado");
        }
        navigate(listRoute);
      } catch (err) {
        console.error(err);
        onSubmitErrorRef.current?.(err);
        toast.error("Ocurrió un error al guardar");
      }
    },
    [isEditing, id, navigate, listRoute]
  );

  return { form, isEditing, loading, onSubmit };
}
