function filterWonProductStatus(products, target_status) {
  return products.filter((p) => p.status === target_status);
}

export { filterWonProductStatus };