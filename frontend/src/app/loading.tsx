import { CardSkeletonGrid } from "@/components/shared/card-skeleton";
import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function RouteLoading() {
  return (
    <Container className="space-y-8 py-16">
      <Skeleton className="h-9 w-2/3 max-w-md" />
      <Skeleton className="h-5 w-full max-w-lg" />
      <CardSkeletonGrid count={6} />
    </Container>
  );
}
