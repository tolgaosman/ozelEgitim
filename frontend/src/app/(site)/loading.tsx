import { CardSkeletonGrid } from "@/components/shared/card-skeleton";
import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function RouteLoading() {
  return (
    <>
      {/* Sabit konumlu, koyu zemin üzerinde şeffaf gezinme çubuğunun bu açık
          renkli sayfada okunaksız kalmaması için lacivert bir üst şerit —
          diğer iç sayfalardaki `PageHero`nun sağladığı kontrastın karşılığı. */}
      <div className="h-28 bg-navy-900 sm:h-32" aria-hidden="true" />
      <Container className="space-y-8 py-16">
        <Skeleton className="h-9 w-2/3 max-w-md" />
        <Skeleton className="h-5 w-full max-w-lg" />
        <CardSkeletonGrid count={6} />
      </Container>
    </>
  );
}
