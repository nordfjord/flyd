type CurriedFunction2<T1, T2, R> = ((t1: T1, t2: T2) => R) & ((t1: T1, ...rest: Array<void>) => (t2: T2) => R);

declare namespace flyd {
  interface Morphism<T, V> {
    (value: T): V;
  }
  interface Stream<T> {
    (): T;
    (value: T): Stream<T>;


    /**
     * @deprecated
     */
    map<V>(accessor: Morphism<T, V>): Stream<V>;
    /**
     * @deprecated
     */
    ap<A, B>(this: Stream<(value: A) => B>, stream: Stream<A>): Stream<B>;
    /**
     * @deprecated
     */
    of<V>(...values: V[]): Stream<V>;

    pipe<V>(operator: (input: Stream<T>) => Stream<V>): Stream<V>;

    ['fantasy-land/map']<V>(accessor: Morphism<T, V>): Stream<V>;
    ['fantasy-land/ap']<V>(morphism: Morphism<Stream<T>, V>): Stream<V>;
    ['fantasy-land/chain']<V>(morphism: Morphism<T, Stream<V>>): Stream<V>;
    ['fantasy-land/of']<V>(...values: V[]): Stream<V>;

    end: Stream<boolean>;
    val: T;
    hasVal: boolean;
  }

  interface Combine {
    <T, R>(fn: (value: Stream<T>, self: Stream<R>) => R | void, streams: [Stream<T>]): Stream<R>;
    <T, T1, R>(
      fn: (value: Stream<T>, t1: Stream<T1>, self: Stream<R>) => R | void,
      streams: [Stream<T>, Stream<T1>]
    ): Stream<R>;
    <T, T1, T2, R>(
      fn: (value: Stream<T>, t1: Stream<T1>, t2: Stream<T2>, self: Stream<R>) => R | void,
      streams: [Stream<T>, Stream<T1>, Stream<T2>]
    ): Stream<R>;

    <T, T1, T2, T3, R>(
      fn: (value: Stream<T>, t1: Stream<T1>, t2: Stream<T2>, t3: Stream<T3>, self: Stream<R>) => R | void,
      streams: [Stream<T>, Stream<T1>, Stream<T2>, Stream<T3>]
    ): Stream<R>;
  }

  interface CreateStream {
    <T>(): Stream<T>;
    <T>(value: T): Stream<T>;
    (): Stream<void>;
  }

  interface Static {
    stream: CreateStream;
    of: CreateStream;

    immediate<T>(stream: Stream<T>): Stream<T>;
    isStream(stream: any): boolean;

    combine: Combine;
    endsOn<T>(end$: Stream<any>, stream: Stream<T>): Stream<T>;

    map<T, V>(accessor: Morphism<T, V>): (stream: Stream<T>) => Stream<V>;
    map<T, V>(accessor: Morphism<T, V>, stream: Stream<T>): Stream<V>;

    ap<A, B>(value$: Stream<A>, transform$: Stream<(value: A) => B>): Stream<B>;
    ap<A>(value$: Stream<A>): <B>(transform$: Stream<Morphism<A, B>>) => Stream<B>

    chain<T, V>(accessor: Morphism<T, Stream<V>>): (stream: Stream<T>) => Stream<V>;
    chain<T, V>(accessor: Morphism<T, Stream<V>>, stream: Stream<T>): Stream<V>;

    on<T>(onfn: (value: T) => void): (stream: Stream<T>) => Stream<void>;
    on<T>(onfn: (value: T) => void, stream: Stream<T>): Stream<void>;

    scan<T, V>(reducer: (acc: T, value: V) => T, initial: T, stream: Stream<V>): Stream<T>;
    scan<T, V>(reducer: (acc: T, value: V) => T, initial: T): (stream: Stream<V>) => Stream<T>;
    scan<T, V>(reducer: (acc: T, value: V) => T): (initial: T) => (stream: Stream<V>) => Stream<T>;

    merge<T, V>(stream1: Stream<T>, stream2: Stream<V>): Stream<T | V>;
    merge<T>(stream1: Stream<T>): <V>(stream2: Stream<V>) => Stream<T | V>;

    transduce<T, V>(mapfn: Function, stream: Stream<T>): Stream<V>;
    transduce<T, V>(mapfn: Function): (stream: Stream<T>) => Stream<V>;

    fromPromise<T>(promise: Promise<T> | PromiseLike<T>): Stream<T>;

    curryN(length: number, fn: (...args: Array<any>) => void): Function;
  }
}

declare module 'flyd' {
  const f: flyd.Static;
  export = f;
}

declare module 'flyd/module/aftersilence' {
  interface aftersilence {
    <T>(delay: number, stream: flyd.Stream<T>): flyd.Stream<T>;
    <T>(delay: number): (stream: flyd.Stream<T>) => flyd.Stream<T>;
  }
  export = aftersilence;
}
declare module 'flyd/module/droprepeats' {
  interface dropRepeats {
    <T>(s: flyd.Stream<T>): flyd.Stream<T>;
  }
  interface dropRepeatsWith {
    <T>(isEqual: (value: T) => boolean, stream: flyd.Stream<T>): flyd.Stream<T>;
    <T>(isEqual: (value: T) => boolean): (stream: flyd.Stream<T>) => flyd.Stream<T>;
  }

  export const dropRepeats: dropRepeats;
  export const dropRepeatsWith: dropRepeatsWith;
}

declare module 'flyd/module/every' {
  interface every {
    (ms: number): flyd.Stream<true>;
  }
  const _every: every;
  export = _every;
}

declare module 'flyd/module/filter' {
  type projection<T> = (val: T) => boolean;
  interface Filter {
    <T>(project: projection<T>, stream: flyd.Stream<T>): flyd.Stream<T>;
    <T>(project: projection<T>): (stream: flyd.Stream<T>) => flyd.Stream<T>;
  }
  const _Filter: Filter;
  export = _Filter;
}

declare module 'flyd/module/flatmap' {
  type projection<T, V> = (val: T) => flyd.Stream<V>;
  interface flatMap {
    <T, V>(project: projection<T, V>, source: flyd.Stream<T>): flyd.Stream<V>;
    <T, V>(project: projection<T, V>): (source: flyd.Stream<T>) => flyd.Stream<V>;
  }
  const _flatMap: flatMap;
  export = _flatMap;
}

declare module 'flyd/module/forwardto' {
  interface ForwardTo {
    <T, V>(stream: flyd.Stream<V>, project: (value: V) => T): flyd.Stream<T>;
    <V>(stream: flyd.Stream<V>): <T>(project: (value: V) => T) => flyd.Stream<T>;
  }
  const _ForwardTo: ForwardTo;
  export = _ForwardTo;
}

declare module 'flyd/module/inlast' {
  interface InLast {
    <T>(ms: number, stream: flyd.Stream<T>): flyd.Stream<T[]>;
    (ms: number): <T>(stream: flyd.Stream<T>) => flyd.Stream<T[]>;
  }

  const _InLast: InLast;
  export = _InLast;
}

declare module 'flyd/module/keepwhen' {
  interface KeepWhen {
    <T>(when: flyd.Stream<boolean>, stream: flyd.Stream<T>): flyd.Stream<T>;
    (when: flyd.Stream<boolean>): <T>(stream: flyd.Stream<T>) => flyd.Stream<T>;
  }
  const _KeepWhen: KeepWhen;
  export = _KeepWhen;
}

declare module 'flyd/module/lift' {
  interface Lift {
    <T1, T2, R>(liftFn: (t1: T1, t2: T2) => R, s1: flyd.Stream<T1>, s2: flyd.Stream<T2>): flyd.Stream<R>;
    <T1, T2, T3, R>(liftFn: (t1: T1, t2: T2, t3: T3) => R, s1: flyd.Stream<T1>, s2: flyd.Stream<T2>, s3: flyd.Stream<T3>): flyd.Stream<R>;
    <T1, T2, T3, T4, R>(liftFn: (t1: T1, t2: T2, t3: T3, t4: T4) => R, s1: flyd.Stream<T1>, s2: flyd.Stream<T2>, s3: flyd.Stream<T3>, s4: flyd.Stream<T4>): flyd.Stream<R>;
    <T>(liftFn: (...rest: any[]) => T, ...streams: flyd.Stream<any>[]): flyd.Stream<T>;
  }

  const _Lift: Lift;
  export = _Lift;
}

declare module 'flyd/module/mergeall' {
  interface MergeAll {
    <T1, T2>(streams: [flyd.Stream<T1>, flyd.Stream<T2>]): flyd.Stream<T1 | T2>;
    <T1, T2, T3>(streams: [flyd.Stream<T1>, flyd.Stream<T2>, flyd.Stream<T3>]): flyd.Stream<T1 | T2 | T3>;
    <T>(streams: flyd.Stream<T>[]): flyd.Stream<T>;
  }
  const _MergeAll: MergeAll;
  export = _MergeAll;
}

declare module 'flyd/module/obj' {
  interface ObjModule {
    streamProps<T>(obj: T): {[P in keyof T]: flyd.Stream<T[P]> };
    extractProps(obj: any): any;
  }

  const _ObjModule: ObjModule;
  export = _ObjModule;
}

declare module 'flyd/module/previous' {
  type previous<T> =
    const _previous: previous; (stream: flyd.Stream<T>) => flyd.Stream<T>;
  export = _previous;
}

declare module 'flyd/module/sampleon' {
  interface SampleOn {
    <T>(samplewhen: flyd.Stream<any>, stream: flyd.Stream<T>): flyd.Stream<T>;
    (samplewhen: flyd.Stream<any>): <T>(stream: flyd.Stream<T>) => flyd.Stream<T>;
  }
  const _SampleOn: SampleOn;
  export = _SampleOn;
}

declare module 'flyd/module/scanmerge' {
  type ScanFn<T, V> = (acc: T, value: V) => T;
  interface ScanMerge {
    <T, V>(pairs: Array<[flyd.Stream<V>, ScanFn<T, V>]>, initial: T): flyd.Stream<T>;
    <T, V>(pairs: Array<[flyd.Stream<V>, ScanFn<T, V>]>): (initial: T) => flyd.Stream<T>;
  }
  const _ScanMerge: ScanMerge;
  export = _ScanMerge;
}

declare module 'flyd/module/switchlatest' {
  interface SwitchLatest {
    <T>(stream: flyd.Stream<flyd.Stream<T>>): flyd.Stream<T>;
  }
  const _SwitchLatest: SwitchLatest;
  export = _SwitchLatest;
}

declare module 'flyd/module/takeuntil' {
  interface takeuntil {
    <T, V>(source: flyd.Stream<T>, end: flyd.Stream<V>): flyd.Stream<T>;
    <T>(source: flyd.Stream<T>): <V>(end: flyd.Stream<V>) => flyd.Stream<T>;
  }
  const _takeuntil: takeuntil;
  export = _takeuntil;
}